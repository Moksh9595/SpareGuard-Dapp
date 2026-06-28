#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, String};

use crate::contract::{SpareGuardContract, SpareGuardContractClient};
use crate::errors::ContractError;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/// Helper to register contract and initialize it.
fn setup(env: &Env) -> SpareGuardContractClient<'_> {
    env.mock_all_auths();
    let contract_id = env.register(SpareGuardContract, ());
    let client = SpareGuardContractClient::new(env, &contract_id);
    client.initialize();
    client
}

/// Returns a set of canonical test part strings.
fn test_part_strings(env: &Env) -> (String, String, String, String, String) {
    (
        String::from_str(env, "Refrigerator"),
        String::from_str(env, "Inverter Compressor Gen-3"),
        String::from_str(env, "REF-COMP-9021"),
        String::from_str(env, "https://ipfs.io/ipfs/QmTestHash"),
        String::from_str(
            env,
            "8f3c7d2e1b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d",
        ),
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

#[test]
fn test_1_initialize_succeeds() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(SpareGuardContract, ());
    let client = SpareGuardContractClient::new(&env, &contract_id);

    // First call must succeed.
    client.initialize();

    // Second call must return AlreadyInitialized.
    let result = client.try_initialize();
    assert_eq!(
        result,
        Err(Ok(ContractError::AlreadyInitialized)),
        "Second initialize() must fail with AlreadyInitialized"
    );
}

#[test]
fn test_2_manufacturer_registration_succeeds() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);
    let name = String::from_str(&env, "Stellar Electrics");

    client.register_manufacturer(&mfg, &name);

    // Verify via is_manufacturer.
    assert!(
        client.is_manufacturer(&mfg),
        "Wallet should be a registered manufacturer after registration"
    );

    // Verify stored profile.
    let profile = client.get_manufacturer(&mfg);
    assert_eq!(profile.wallet, mfg);
    assert_eq!(profile.name, name);
}

#[test]
fn test_3_duplicate_manufacturer_registration_fails() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);
    let name = String::from_str(&env, "Stellar Electrics");

    // First registration succeeds.
    client.register_manufacturer(&mfg, &name);

    // Second registration must fail.
    let result = client.try_register_manufacturer(&mfg, &name);
    assert_eq!(
        result,
        Err(Ok(ContractError::ManufacturerAlreadyRegistered)),
        "Duplicate manufacturer registration must be rejected"
    );
}

#[test]
fn test_4_add_part_succeeds() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);

    client.register_manufacturer(&mfg, &String::from_str(&env, "Stellar Electrics"));

    let (product, part_name, part_code, ipfs, hash) = test_part_strings(&env);

    let part = client.add_part(&mfg, &product, &part_name, &part_code, &ipfs, &hash);

    // Verify returned struct matches inputs.
    assert_eq!(part.id, 1, "First part must have id = 1");
    assert_eq!(part.part_code, part_code);
    assert_eq!(part.hash, hash);
    assert_eq!(part.verification_count, 0);
    assert_eq!(part.manufacturer_wallet, mfg);

    // Verify retrieval via get_part.
    let fetched = client.get_part(&part_code);
    assert_eq!(fetched.id, 1);
    assert_eq!(fetched.product_name, product);
}

#[test]
fn test_5_duplicate_part_code_rejected() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);

    client.register_manufacturer(&mfg, &String::from_str(&env, "Stellar Electrics"));

    let (product, part_name, part_code, ipfs, hash) = test_part_strings(&env);

    // First registration succeeds.
    client.add_part(&mfg, &product, &part_name, &part_code, &ipfs, &hash);

    // Duplicate part_code must be rejected.
    let hash2 = String::from_str(
        &env,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    );
    let result = client.try_add_part(&mfg, &product, &part_name, &part_code, &ipfs, &hash2);
    assert_eq!(
        result,
        Err(Ok(ContractError::DuplicatePartCode)),
        "Duplicate part_code must be rejected with DuplicatePartCode"
    );
}

#[test]
fn test_6_verify_genuine_part_succeeds() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);
    let customer = Address::generate(&env);

    client.register_manufacturer(&mfg, &String::from_str(&env, "Stellar Electrics"));

    let (product, part_name, part_code, ipfs, hash) = test_part_strings(&env);
    client.add_part(&mfg, &product, &part_name, &part_code, &ipfs, &hash);

    // Customer verifies.
    let is_genuine = client.verify_part(&customer, &part_code, &hash);
    assert!(is_genuine, "Correct part_code + hash must return true");

    // Verification count must be incremented.
    let fetched = client.get_part(&part_code);
    assert_eq!(
        fetched.verification_count, 1,
        "verification_count must be 1 after one successful verify"
    );
}

#[test]
fn test_7_wrong_hash_returns_hash_mismatch() {
    let env = Env::default();
    let client = setup(&env);
    let mfg = Address::generate(&env);
    let customer = Address::generate(&env);

    client.register_manufacturer(&mfg, &String::from_str(&env, "Stellar Electrics"));

    let (product, part_name, part_code, ipfs, hash) = test_part_strings(&env);
    client.add_part(&mfg, &product, &part_name, &part_code, &ipfs, &hash);

    // Tampered / wrong hash.
    let wrong_hash = String::from_str(
        &env,
        "0000000000000000000000000000000000000000000000000000000000000000",
    );
    let result = client.try_verify_part(&customer, &part_code, &wrong_hash);
    assert_eq!(
        result,
        Err(Ok(ContractError::HashMismatch)),
        "Correct part_code but wrong hash must return HashMismatch"
    );

    // verification_count must NOT be incremented.
    let fetched = client.get_part(&part_code);
    assert_eq!(
        fetched.verification_count, 0,
        "verification_count must remain 0 after failed verify"
    );
}

#[test]
fn test_8_unregistered_wallet_cannot_add_part() {
    let env = Env::default();
    let client = setup(&env);
    let attacker = Address::generate(&env);

    let (product, part_name, part_code, ipfs, hash) = test_part_strings(&env);

    let result = client.try_add_part(&attacker, &product, &part_name, &part_code, &ipfs, &hash);
    assert_eq!(
        result,
        Err(Ok(ContractError::ManufacturerNotRegistered)),
        "Unregistered wallet must be rejected with ManufacturerNotRegistered"
    );
}
