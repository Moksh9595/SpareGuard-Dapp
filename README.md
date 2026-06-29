## SpareGuard : Spare Part Authentication Dapp

**SpareGuard** is a blockchain-based DApp that helps customers verify the authenticity of automobile spare parts. It creates a direct trust bridge between manufacturers and customers by securely storing product information on the blockchain. Before using a spare part, customers can easily verify whether it is genuine or counterfeit, ensuring transparency, preventing fraud, and building confidence in the supply chain.

## ⭐ Key Features :

1. Blockchain-Based Spare Part Authentication

Every genuine spare part is securely registered on the Stellar blockchain, creating a tamper-proof and immutable record. Customers can verify the authenticity of a spare part anytime, ensuring protection against counterfeit products.

2. Role-Based Access Control

The DApp provides two distinct user roles: Manufacturer and Customer. Only registered manufacturers can add genuine spare part records to the blockchain, while customers can only verify spare parts, ensuring secure and authorized access.

3. Secure Hash Verification

Each spare part is assigned a unique SHA-256 hash generated from its details. During verification, the customer enters the part code and hash, which are matched against the blockchain records to determine whether the spare part is genuine or counterfeit.

4. Decentralized Image Storage with IPFS

Spare part images are stored using IPFS (Pinata) instead of centralized servers. This ensures decentralized, reliable, and tamper-resistant storage while reducing blockchain storage costs.

5. Freighter Wallet Integration

The application integrates with the Freighter Wallet for secure authentication and transaction approval. Manufacturers authorize the addition of new spare parts, and customers confirm verification requests through wallet signatures, ensuring secure blockchain interactions.

6. Real-Time Verification Dashboard

Manufacturers can manage and view all registered spare parts through an intuitive dashboard, while customers receive instant verification results, including product details, manufacturer information, image, and authenticity status, providing a transparent and user-friendly experience.


## 🚀 How to Set up and Run Locally

 ## Pre-Requesits to Run :

 1. Download Freighter wallet web extension.
 2. set up your Freighter Wallet.
 3. VS code should be installed
    
 ## How To Run :

 open in VS code ----> Go to Terminal ----> cd SpareGuardMain ----> Give a command "npm run dev" ----> Run on Localhost (CTRL + click) ----->You're Ready To Go. 🚀 

 or

 simply click on deployed dapp link (deployed on vercel)



## Working Screenshots :

<img width="1918" height="1062" alt="image" src="https://github.com/user-attachments/assets/c586722e-3236-4609-9cd4-23cfe45765d4" />

<img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/9e228b38-7230-4934-910b-173352dc18eb" />

<img width="1918" height="1077" alt="image" src="https://github.com/user-attachments/assets/8bd08b4d-850b-43c2-958c-f08702d79247" />

<img width="1918" height="865" alt="image" src="https://github.com/user-attachments/assets/ae1de149-f8ac-466f-96f3-637fa879087a" />

<img width="1913" height="1073" alt="image" src="https://github.com/user-attachments/assets/f25c8d30-beb6-47cd-bb3f-b1cc346c853d" />

## mobile Responsive :

<img width="720" height="1600" alt="WhatsApp Image 2026-06-29 at 12 02 21 AM" src="https://github.com/user-attachments/assets/5ad33b58-70dd-46d3-bf0d-4bf9aa622c31" />

## Contract Details :

contract ID : 'CCTCP3IDLYLZN7BDGZB2L64ADV3GAJURF6I443CALD3LQIEWRHBAOBKC'

<img width="1918" height="903" alt="image" src="https://github.com/user-attachments/assets/735b4723-cb45-4ee1-a331-bd63013a2eb4" />

<img width="1913" height="910" alt="image" src="https://github.com/user-attachments/assets/5fbbd33b-ec82-4f04-8bf8-b3affc9433b8" />




 ## 🧪 Test Passing Results :

 <img width="1478" height="738" alt="image" src="https://github.com/user-attachments/assets/1196198c-e648-43c5-bc73-69d2112678ba" />


   Finished `test` profile [unoptimized + debuginfo] target(s) in 32.72s
     Running unittests src\lib.rs (target\debug\deps\spare_guard-320e58879d216ebd.exe)

running 8 tests
test test::test_8_unregistered_wallet_cannot_add_part ... ok
test test::test_1_initialize_succeeds ... ok
test test::test_2_manufacturer_registration_succeeds ... ok
test test::test_3_duplicate_manufacturer_registration_fails ... ok
test test::test_7_wrong_hash_returns_hash_mismatch ... ok
test test::test_4_add_part_succeeds ... ok
test test::test_6_verify_genuine_part_succeeds ... ok
test test::test_5_duplicate_part_code_rejected ... ok

test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.09s


## CI/CD pipeline setup :

<img width="1918" height="742" alt="image" src="https://github.com/user-attachments/assets/be0f4d2e-90c5-4b66-9a17-1367084b7c60" />



## Working Demo link :

https://drive.google.com/file/d/1XGvgC2ZOfAPJ-3lLBR7LhGqIgaVt-gin/view?usp=sharing



 



