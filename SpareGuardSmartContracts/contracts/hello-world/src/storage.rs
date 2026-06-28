use soroban_sdk::{contracttype, Address, Env, String, Vec};

use crate::types::{Manufacturer, Part};

// ─────────────────────────────────────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────────────────────────────────────

/// Every entry in persistent storage is addressed by a `DataKey` variant.
///
/// Rules:
///  - **Never rename** an existing variant — it would orphan live ledger data.
///  - **Never reorder** variants — `contracttype` serialises by discriminant.
///  - Add new variants at the **end** only.
///
/// Key design:
///  - `Initialized`       → one boolean sentinel; guards `initialize()`.
///  - `PartCounter`       → u64 monotonic counter; source of truth for `id`.
///  - `Manufacturer(addr)`→ one entry per wallet; manufacturer profile.
///  - `Part(part_code)`   → one entry per part_code; the full `Part` struct.
///  - `HashIndex(hash)`   → maps a hash string to the owning `part_code`.
///  - `PartIndex(n)`      → maps sequential index n → part_code for iteration.
///  - `PartIndexLen`      → length of the PartIndex list (u64).
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    /// Sentinel: has `initialize()` been called?
    Initialized,

    /// Global monotonic part ID counter (u64).
    PartCounter,

    /// Manufacturer profile keyed by wallet address.
    Manufacturer(Address),

    /// Full `Part` record keyed by its `part_code` string.
    Part(String),

    /// Hash → part_code reverse-lookup index.
    HashIndex(String),

    /// Ordered list: position n → part_code string.
    /// Enables `get_all_parts()` without scanning unbounded storage.
    PartIndex(u64),

    /// Total number of entries in the `PartIndex` list.
    PartIndexLen,
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialization sentinel
// ─────────────────────────────────────────────────────────────────────────────

/// Returns `true` if the contract has already been initialized.
pub fn is_initialized(env: &Env) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::Initialized)
}

/// Marks the contract as initialized. Call only once inside `initialize()`.
pub fn set_initialized(env: &Env) {
    env.storage()
        .persistent()
        .set(&DataKey::Initialized, &true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Part counter
// ─────────────────────────────────────────────────────────────────────────────

/// Reads the current part counter, defaulting to 0 if not set.
pub fn get_part_counter(env: &Env) -> u64 {
    env.storage()
        .persistent()
        .get(&DataKey::PartCounter)
        .unwrap_or(0u64)
}

/// Writes the part counter back to storage.
pub fn set_part_counter(env: &Env, counter: u64) {
    env.storage()
        .persistent()
        .set(&DataKey::PartCounter, &counter);
}

// ─────────────────────────────────────────────────────────────────────────────
// Manufacturer registry
// ─────────────────────────────────────────────────────────────────────────────

/// Returns `true` if the wallet address is a registered manufacturer.
pub fn has_manufacturer(env: &Env, wallet: &Address) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::Manufacturer(wallet.clone()))
}

/// Retrieves a manufacturer profile.  Returns `None` if not registered.
pub fn get_manufacturer(env: &Env, wallet: &Address) -> Option<Manufacturer> {
    env.storage()
        .persistent()
        .get(&DataKey::Manufacturer(wallet.clone()))
}

/// Persists a manufacturer profile.
pub fn set_manufacturer(env: &Env, wallet: &Address, manufacturer: &Manufacturer) {
    env.storage()
        .persistent()
        .set(&DataKey::Manufacturer(wallet.clone()), manufacturer);
}

// ─────────────────────────────────────────────────────────────────────────────
// Part registry
// ─────────────────────────────────────────────────────────────────────────────

/// Returns `true` if a part with the given `part_code` exists.
pub fn has_part_by_code(env: &Env, part_code: &String) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::Part(part_code.clone()))
}

/// Retrieves a part by its `part_code`.  Returns `None` if not found.
pub fn get_part_by_code(env: &Env, part_code: &String) -> Option<Part> {
    env.storage()
        .persistent()
        .get(&DataKey::Part(part_code.clone()))
}

/// Persists a part, keyed by `part_code`.
pub fn set_part(env: &Env, part: &Part) {
    env.storage()
        .persistent()
        .set(&DataKey::Part(part.part_code.clone()), part);
}

// ─────────────────────────────────────────────────────────────────────────────
// Hash → part_code reverse index
// ─────────────────────────────────────────────────────────────────────────────

/// Returns `true` if this hash is already registered by any part.
pub fn has_hash_index(env: &Env, hash: &String) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::HashIndex(hash.clone()))
}

/// Writes a hash → part_code mapping into the reverse index.
pub fn set_hash_index(env: &Env, hash: &String, part_code: &String) {
    env.storage()
        .persistent()
        .set(&DataKey::HashIndex(hash.clone()), part_code);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sequential part index (supports get_all_parts)
// ─────────────────────────────────────────────────────────────────────────────

/// Returns the current length of the ordered part index.
fn get_part_index_len(env: &Env) -> u64 {
    env.storage()
        .persistent()
        .get(&DataKey::PartIndexLen)
        .unwrap_or(0u64)
}

/// Appends a `part_code` to the end of the ordered index.
/// Called once per `add_part()` — never call for updates.
pub fn append_part_index(env: &Env, part_code: &String) {
    let len = get_part_index_len(env);
    env.storage()
        .persistent()
        .set(&DataKey::PartIndex(len), part_code);
    env.storage()
        .persistent()
        .set(&DataKey::PartIndexLen, &(len + 1));
}

/// Collects every part from storage in insertion order.
///
/// Performance note: iterates all indexed `part_code` keys and loads each
/// `Part` struct.  For very large catalogs a paginated `get_parts_page()`
/// function can be added without changing this signature.
pub fn get_all_parts(env: &Env) -> Vec<Part> {
    let len = get_part_index_len(env);
    let mut parts: Vec<Part> = Vec::new(env);

    for i in 0..len {
        if let Some(part_code) = env
            .storage()
            .persistent()
            .get::<DataKey, String>(&DataKey::PartIndex(i))
        {
            if let Some(part) = get_part_by_code(env, &part_code) {
                parts.push_back(part);
            }
        }
    }
    parts
}
