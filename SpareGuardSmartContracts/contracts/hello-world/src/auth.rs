use soroban_sdk::{Address, Env};

use crate::errors::ContractError;
use crate::storage;

// ─────────────────────────────────────────────────────────────────────────────
// Input validation helpers
// ─────────────────────────────────────────────────────────────────────────────

/// Checks that a Soroban `String` is non-empty.
///
/// `soroban_sdk::String` does not implement `is_empty()` directly; we compare
/// its `len()` against zero instead.
pub fn require_non_empty(s: &soroban_sdk::String) -> Result<(), ContractError> {
    if s.len() == 0 {
        Err(ContractError::EmptyField)
    } else {
        Ok(())
    }
}

/// Validates a `part_code` string: must be non-empty.
///
/// Add further format checks here (e.g. regex via byte-by-byte scan) without
/// changing the call sites in `contract.rs`.
pub fn require_valid_part_code(part_code: &soroban_sdk::String) -> Result<(), ContractError> {
    if part_code.len() == 0 {
        return Err(ContractError::InvalidPartCode);
    }
    Ok(())
}

/// Validates an IPFS URL field: must be non-empty.
///
/// Additional prefix checks (e.g. starts with "ipfs://" or "https://") can be
/// added here without touching `contract.rs`.
pub fn require_valid_ipfs(ipfs: &soroban_sdk::String) -> Result<(), ContractError> {
    if ipfs.len() == 0 {
        return Err(ContractError::InvalidIPFS);
    }
    Ok(())
}

// ─────────────────────────────────────────────────────────────────────────────
// Authorization helpers
// ─────────────────────────────────────────────────────────────────────────────

/// Calls Soroban's `require_auth()` on the given address and then verifies
/// that the address is registered as a manufacturer.
///
/// Returns `Err(ManufacturerNotRegistered)` if the wallet is not in the
/// manufacturer registry, preventing any non-manufacturer from adding parts.
///
/// # Arguments
/// * `env`    - The contract environment.
/// * `wallet` - The address that must be authenticated and registered.
pub fn require_manufacturer(env: &Env, wallet: &Address) -> Result<(), ContractError> {
    // Soroban enforces cryptographic authentication.
    // If the caller did not sign with `wallet`'s private key this panics,
    // which is the correct behaviour (unauthorized invocations must never
    // proceed past this point).
    wallet.require_auth();

    if !storage::has_manufacturer(env, wallet) {
        return Err(ContractError::ManufacturerNotRegistered);
    }

    Ok(())
}

/// Calls `require_auth()` on the given address without checking the
/// manufacturer registry.  Used for operations any authenticated wallet may
/// perform (e.g. `verify_part()`).
pub fn require_auth(wallet: &Address) {
    wallet.require_auth();
}
