use soroban_sdk::{contracttype, Address, String};

// ─────────────────────────────────────────────────────────────────────────────
// Manufacturer
// ─────────────────────────────────────────────────────────────────────────────

/// On-chain record for a registered manufacturer.
///
/// Stored once per wallet address.  All fields are intentionally flat so the
/// JS/TypeScript client can deserialize without transformation.
///
/// Future-proof fields (e.g. `logo_ipfs`, `website_url`, `verified_by_admin`)
/// can be added in a `ManufacturerV2` type and migrated via a separate storage
/// key without breaking this struct.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Manufacturer {
    /// The Stellar address that owns this manufacturer account.
    pub wallet: Address,

    /// Human-readable name shown in the frontend (e.g. "Stellar Electrics").
    pub name: String,

    /// Unix timestamp (seconds) at which the manufacturer was registered.
    /// Populated automatically by the contract from `env.ledger().timestamp()`.
    pub registered_at: u64,
}

// ─────────────────────────────────────────────────────────────────────────────
// Part
// ─────────────────────────────────────────────────────────────────────────────

/// On-chain record for a registered spare part.
///
/// All string fields are `soroban_sdk::String` (not `std::string::String`),
/// which is the correct type for `no_std` Soroban contracts.
///
/// Field ordering is intentionally stable — appending fields at the end is
/// safe; renaming or reordering will break existing ledger data.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Part {
    /// Auto-incremented, globally unique identifier assigned at registration.
    pub id: u64,

    /// Stellar address of the manufacturer who registered this part.
    pub manufacturer_wallet: Address,

    /// Snapshot of the manufacturer name at registration time.
    /// Stored denormalized so that a single `get_part()` call returns
    /// everything the frontend needs without a second lookup.
    pub manufacturer_name: String,

    /// Appliance category (e.g. "Refrigerator", "Washing Machine").
    pub product_name: String,

    /// Specific component name (e.g. "Inverter Compressor Gen-3").
    pub part_name: String,

    /// Short alphanumeric code printed on the physical part
    /// (e.g. "REF-COMP-9021").  Must be unique across all parts.
    pub part_code: String,

    /// IPFS content identifier or gateway URL for the part image / datasheet.
    pub ipfs_image: String,

    /// SHA-256 cryptographic digest of the part's canonical data.
    /// Must be unique across all parts and is the primary verification key.
    pub hash: String,

    /// Unix timestamp (seconds) when the part was registered on the ledger.
    pub created_at: u64,

    /// Running count of successful `verify_part()` calls for this part.
    /// Incremented atomically by the contract on every successful match.
    pub verification_count: u32,
}
