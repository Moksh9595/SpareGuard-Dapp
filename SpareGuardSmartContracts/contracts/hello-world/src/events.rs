use soroban_sdk::{symbol_short, Address, Env, String};

// ─────────────────────────────────────────────────────────────────────────────
// Event topic symbols
// ─────────────────────────────────────────────────────────────────────────────
//
// `symbol_short!` is evaluated at compile time and limited to 9 ASCII chars.
// Keep these stable — changing a topic string breaks event indexers and the
// frontend's event subscription subscriptions.

/// Emitted when a new manufacturer is successfully registered.
///
/// Topics : ["mfg_reg", wallet]
/// Data   : { name: String, registered_at: u64 }
pub fn manufacturer_registered(env: &Env, wallet: &Address, name: &String, registered_at: u64) {
    env.events().publish(
        (symbol_short!("mfg_reg"), wallet.clone()),
        (name.clone(), registered_at),
    );
}

/// Emitted when a new spare part is successfully added to the ledger.
///
/// Topics : ["part_add", part_code]
/// Data   : { manufacturer_wallet: Address, product_name: String, created_at: u64 }
pub fn part_added(
    env: &Env,
    part_code: &String,
    manufacturer_wallet: &Address,
    product_name: &String,
    created_at: u64,
) {
    env.events().publish(
        (symbol_short!("part_add"), part_code.clone()),
        (manufacturer_wallet.clone(), product_name.clone(), created_at),
    );
}

/// Emitted when a `verify_part()` call confirms a genuine match.
///
/// Topics : ["part_ver", part_code]
/// Data   : { verifier: Address, timestamp: u64, verification_count: u32 }
pub fn part_verified(
    env: &Env,
    part_code: &String,
    verifier: &Address,
    timestamp: u64,
    verification_count: u32,
) {
    env.events().publish(
        (symbol_short!("part_ver"), part_code.clone()),
        (verifier.clone(), timestamp, verification_count),
    );
}
