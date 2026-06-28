use soroban_sdk::contracterror;

/// All failure modes that the SpareGuard contract can produce.
///
/// Every variant maps to a stable u32 discriminant.  Do **not** renumber or
/// remove variants — the frontend parses these codes to show human-readable
/// error messages.  Only append new variants at the end.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum ContractError {
    /// `initialize()` was called more than once.
    AlreadyInitialized = 1,

    /// `register_manufacturer()` called for an address that is already in the
    /// manufacturer registry.
    ManufacturerAlreadyRegistered = 2,

    /// A function that requires manufacturer privileges was called by a wallet
    /// that has not been registered via `register_manufacturer()`.
    ManufacturerNotRegistered = 3,

    /// The caller does not have the required on-chain role to perform this
    /// action (e.g. a customer tries to add a part).
    Unauthorized = 4,

    /// `add_part()` was called with a `part_code` that already exists in the
    /// Part Code lookup index.
    DuplicatePartCode = 5,

    /// `add_part()` was called with a cryptographic `hash` that already exists
    /// in the Hash lookup index.
    DuplicateHash = 6,

    /// The provided `part_code` does not pass basic format validation (e.g.
    /// empty string, or contains illegal characters).
    InvalidPartCode = 7,

    /// `get_part()` or `verify_part()` was called for a `part_code` that does
    /// not exist in storage.
    PartNotFound = 8,

    /// `verify_part()` found the `part_code` but the supplied `hash` does not
    /// match the hash stored on the ledger.
    HashMismatch = 9,

    /// The `ipfs_image` URL failed validation (e.g. empty string).
    InvalidIPFS = 10,

    /// Any required string field was supplied as an empty string.
    EmptyField = 11,
}
