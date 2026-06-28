//! # SpareGuard — Soroban Smart Contract
//!
//! Spare Part Authentication DApp built on the Stellar network using Soroban
//! smart contracts.
//!
//! ## Module layout
//!
//! | Module       | Responsibility                                          |
//! |--------------|---------------------------------------------------------|
//! | `types`      | `Part` and `Manufacturer` structs (`#[contracttype]`)   |
//! | `errors`     | `ContractError` enum (`#[contracterror]`)               |
//! | `storage`    | All persistent-storage read/write helpers               |
//! | `auth`       | Input validation + `require_auth` wrappers              |
//! | `events`     | Event emission functions                                |
//! | `contract`   | `SpareGuardContract` + `#[contractimpl]` block          |
//! | `test`       | Unit tests (compiled only with `cfg(test)`)             |
//!
//! ## Frontend API (stable, do not rename)
//!
//! ```text
//! initialize()
//! register_manufacturer(wallet, name)
//! is_manufacturer(wallet)
//! get_manufacturer(wallet)
//! add_part(manufacturer_wallet, product_name, part_name,
//!          part_code, ipfs_image, hash)
//! verify_part(verifier, part_code, hash)
//! get_part(part_code)
//! get_all_parts()
//! ```

#![no_std]

pub mod auth;
pub mod contract;
pub mod errors;
pub mod events;
pub mod storage;
pub mod types;

// Re-export the contract struct and its generated client so test.rs can
// import them from `crate::contract`.
pub use contract::SpareGuardContract;

#[cfg(test)]
mod test;
