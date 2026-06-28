use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

use crate::auth;
use crate::errors::ContractError;
use crate::events;
use crate::storage;
use crate::types::{Manufacturer, Part};

// ─────────────────────────────────────────────────────────────────────────────
// Contract struct
// ─────────────────────────────────────────────────────────────────────────────

/// SpareGuard smart contract.
///
/// All public functions are intentionally flat: simple scalar / String inputs
/// and predictable return types so that the Freighter + JS/TypeScript client
/// can call them without additional transformation layers.
#[contract]
pub struct SpareGuardContract;

// ─────────────────────────────────────────────────────────────────────────────
// Contract implementation
// ─────────────────────────────────────────────────────────────────────────────

#[contractimpl]
impl SpareGuardContract {
    // ─────────────────────────────────────────────────────────────────────
    // initialize
    // ─────────────────────────────────────────────────────────────────────

    /// One-time setup for the contract.
    ///
    /// Seeds the `PartCounter` at 0 and writes the `Initialized` sentinel so
    /// that subsequent calls fail cleanly instead of resetting state.
    ///
    /// # Errors
    /// * `AlreadyInitialized` – contract has already been set up.
    pub fn initialize(env: Env) -> Result<(), ContractError> {
        if storage::is_initialized(&env) {
            return Err(ContractError::AlreadyInitialized);
        }
        storage::set_initialized(&env);
        storage::set_part_counter(&env, 0);
        Ok(())
    }

    // ─────────────────────────────────────────────────────────────────────
    // register_manufacturer
    // ─────────────────────────────────────────────────────────────────────

    /// Registers a new manufacturer on the ledger.
    ///
    /// Requires that the calling transaction is signed by `wallet`.
    /// Stores a `Manufacturer` record in persistent storage and emits a
    /// `mfg_reg` event.
    ///
    /// # Arguments
    /// * `wallet` – Stellar address of the manufacturer; must sign the tx.
    /// * `name`   – Human-readable company name (must be non-empty).
    ///
    /// # Errors
    /// * `EmptyField`                  – `name` is empty.
    /// * `ManufacturerAlreadyRegistered` – wallet already in registry.
    pub fn register_manufacturer(
        env: Env,
        wallet: Address,
        name: String,
    ) -> Result<(), ContractError> {
        // Authenticate the caller.
        wallet.require_auth();

        // Validate inputs.
        auth::require_non_empty(&name)?;

        // Guard against duplicate registrations.
        if storage::has_manufacturer(&env, &wallet) {
            return Err(ContractError::ManufacturerAlreadyRegistered);
        }

        let timestamp = env.ledger().timestamp();

        let manufacturer = Manufacturer {
            wallet: wallet.clone(),
            name: name.clone(),
            registered_at: timestamp,
        };

        storage::set_manufacturer(&env, &wallet, &manufacturer);

        // Emit event so off-chain indexers (and the frontend's event feed) can
        // track registrations without polling storage.
        events::manufacturer_registered(&env, &wallet, &name, timestamp);

        Ok(())
    }

    // ─────────────────────────────────────────────────────────────────────
    // is_manufacturer
    // ─────────────────────────────────────────────────────────────────────

    /// Returns `true` if `wallet` is a registered manufacturer, `false`
    /// otherwise.
    ///
    /// This is a read-only query — no auth required.
    pub fn is_manufacturer(env: Env, wallet: Address) -> bool {
        storage::has_manufacturer(&env, &wallet)
    }

    // ─────────────────────────────────────────────────────────────────────
    // get_manufacturer
    // ─────────────────────────────────────────────────────────────────────

    /// Returns the `Manufacturer` profile for `wallet`.
    ///
    /// # Errors
    /// * `ManufacturerNotRegistered` – wallet is not in the registry.
    pub fn get_manufacturer(env: Env, wallet: Address) -> Result<Manufacturer, ContractError> {
        storage::get_manufacturer(&env, &wallet)
            .ok_or(ContractError::ManufacturerNotRegistered)
    }

    // ─────────────────────────────────────────────────────────────────────
    // add_part
    // ─────────────────────────────────────────────────────────────────────

    /// Registers a new spare part on the ledger.
    ///
    /// Only callable by a registered manufacturer.  All string inputs are
    /// validated for non-emptiness.  Both `part_code` and `hash` are checked
    /// against their respective lookup indexes to prevent duplicates.
    ///
    /// On success the global `PartCounter` is incremented and the new `Part`
    /// is written to three storage locations:
    ///   1. `Part(part_code)`  — primary record.
    ///   2. `HashIndex(hash)`  — reverse lookup (hash → part_code).
    ///   3. `PartIndex(n)`     — sequential list for `get_all_parts()`.
    ///
    /// # Arguments
    /// * `manufacturer_wallet` – Must be a registered manufacturer and must
    ///                           sign the transaction.
    /// * `product_name`        – Appliance category (e.g. "Refrigerator").
    /// * `part_name`           – Component name (e.g. "Inverter Compressor").
    /// * `part_code`           – Unique alphanumeric serial (e.g. "REF-001").
    /// * `ipfs_image`          – IPFS URL / CID for the part image.
    /// * `hash`                – SHA-256 hex digest; must be unique.
    ///
    /// # Errors
    /// * `ManufacturerNotRegistered` – wallet not in registry.
    /// * `EmptyField`               – any string arg is empty.
    /// * `InvalidPartCode`          – `part_code` fails format check.
    /// * `InvalidIPFS`              – `ipfs_image` fails format check.
    /// * `DuplicatePartCode`        – `part_code` already registered.
    /// * `DuplicateHash`            – `hash` already registered.
    pub fn add_part(
        env: Env,
        manufacturer_wallet: Address,
        product_name: String,
        part_name: String,
        part_code: String,
        ipfs_image: String,
        hash: String,
    ) -> Result<Part, ContractError> {
        // Authenticate + verify manufacturer role.
        auth::require_manufacturer(&env, &manufacturer_wallet)?;

        // Validate every string field.
        auth::require_non_empty(&product_name)?;
        auth::require_non_empty(&part_name)?;
        auth::require_valid_part_code(&part_code)?;
        auth::require_valid_ipfs(&ipfs_image)?;
        auth::require_non_empty(&hash)?;

        // Enforce uniqueness.
        if storage::has_part_by_code(&env, &part_code) {
            return Err(ContractError::DuplicatePartCode);
        }
        if storage::has_hash_index(&env, &hash) {
            return Err(ContractError::DuplicateHash);
        }

        // Load manufacturer name for denormalized storage in the Part record.
        // Safe to unwrap: `require_manufacturer` already verified it exists.
        let mfg = storage::get_manufacturer(&env, &manufacturer_wallet)
            .ok_or(ContractError::ManufacturerNotRegistered)?;

        // Assign the next available ID (checked increment — no overflow panic
        // because `checked_add` returns None on overflow instead of panicking,
        // but u64 overflow is practically impossible in production).
        let current_counter = storage::get_part_counter(&env);
        let new_id = current_counter
            .checked_add(1)
            .unwrap_or(u64::MAX); // saturate rather than panic
        storage::set_part_counter(&env, new_id);

        let timestamp = env.ledger().timestamp();

        let part = Part {
            id: new_id,
            manufacturer_wallet: manufacturer_wallet.clone(),
            manufacturer_name: mfg.name,
            product_name: product_name.clone(),
            part_name,
            part_code: part_code.clone(),
            ipfs_image,
            hash: hash.clone(),
            created_at: timestamp,
            verification_count: 0,
        };

        // Persist primary record.
        storage::set_part(&env, &part);

        // Build reverse hash index.
        storage::set_hash_index(&env, &hash, &part_code);

        // Append to ordered list for `get_all_parts()`.
        storage::append_part_index(&env, &part_code);

        // Emit event.
        events::part_added(&env, &part_code, &manufacturer_wallet, &product_name, timestamp);

        Ok(part)
    }

    // ─────────────────────────────────────────────────────────────────────
    // verify_part
    // ─────────────────────────────────────────────────────────────────────

    /// Verifies a spare part by checking `part_code` + `hash` against the
    /// ledger.
    ///
    /// Any authenticated wallet may call this function (customers do not need
    /// to be registered manufacturers).
    ///
    /// On a successful match the `verification_count` of the matched part is
    /// atomically incremented and a `part_ver` event is emitted.
    ///
    /// # Arguments
    /// * `verifier`  – Address of the wallet performing the check.
    /// * `part_code` – The serial code printed on the physical part.
    /// * `hash`      – The cryptographic digest to validate.
    ///
    /// # Returns
    /// `Ok(true)` if genuine, `Err(PartNotFound)` or `Err(HashMismatch)` if
    /// the verification fails.
    ///
    /// # Errors
    /// * `EmptyField`    – either input string is empty.
    /// * `PartNotFound`  – `part_code` does not exist on the ledger.
    /// * `HashMismatch`  – `part_code` exists but `hash` does not match.
    pub fn verify_part(
        env: Env,
        verifier: Address,
        part_code: String,
        hash: String,
    ) -> Result<bool, ContractError> {
        // Any authenticated wallet may verify — no manufacturer check needed.
        auth::require_auth(&verifier);

        // Validate inputs.
        auth::require_valid_part_code(&part_code)?;
        auth::require_non_empty(&hash)?;

        // Look up the part.
        let mut part = storage::get_part_by_code(&env, &part_code)
            .ok_or(ContractError::PartNotFound)?;

        // Compare hashes.  We use byte-by-byte string comparison via PartialEq
        // which is constant-time in Soroban's String implementation.
        if part.hash != hash {
            return Err(ContractError::HashMismatch);
        }

        // Genuine match — increment verification counter (saturating to avoid
        // overflow on u32 after billions of scans).
        part.verification_count = part.verification_count.saturating_add(1);
        storage::set_part(&env, &part);

        let timestamp = env.ledger().timestamp();

        // Emit verification event for off-chain analytics.
        events::part_verified(&env, &part_code, &verifier, timestamp, part.verification_count);

        Ok(true)
    }

    // ─────────────────────────────────────────────────────────────────────
    // get_part
    // ─────────────────────────────────────────────────────────────────────

    /// Returns the full `Part` record for the given `part_code`.
    ///
    /// Read-only; no authentication required.
    ///
    /// # Errors
    /// * `InvalidPartCode` – `part_code` is empty.
    /// * `PartNotFound`    – no part exists with that code.
    pub fn get_part(env: Env, part_code: String) -> Result<Part, ContractError> {
        auth::require_valid_part_code(&part_code)?;

        storage::get_part_by_code(&env, &part_code)
            .ok_or(ContractError::PartNotFound)
    }

    // ─────────────────────────────────────────────────────────────────────
    // get_all_parts
    // ─────────────────────────────────────────────────────────────────────

    /// Returns all registered parts in insertion order as a `Vec<Part>`.
    ///
    /// Read-only; no authentication required.
    ///
    /// For catalogs with many parts the frontend should consider paginating
    /// with a future `get_parts_page(offset, limit)` function.  This function
    /// signature will remain stable even after pagination is added.
    pub fn get_all_parts(env: Env) -> Vec<Part> {
        storage::get_all_parts(&env)
    }
}
