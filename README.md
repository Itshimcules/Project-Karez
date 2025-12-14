# Project Karez (Afghanistan Medical Records)

An offline-first, privacy-centric medical record system designed for environments with intermittent internet connectivity.

## Architecture Overview

1.  **Mobile App (`/mobile-app`)**:
    *   **Role**: Primary interface for Doctors.
    *   **Tech**: React Native + RxDB (Local Database).
    *   **Features**: Biometric Login (simulated), Offline Record Creation, Peer-to-Peer Sync (optional), Delayed Uplink.

2.  **Regional Node (`/regional-node`)**:
    *   **Role**: Local server at clinic/hospital.
    *   **Tech**: Node.js/Express + IPFS Node.
    *   **Features**: Batches records from mobile devices, stores heavy files (X-rays) on IPFS, submits hashes to Blockchain.

3.  **Blockchain Network (`/blockchain-network`)**:
    *   **Role**: Immutable Truth Source.
    *   **Tech**: Custom PoA (Proof of Authority) Chain or Hyperledger mockup.
    *   **Functions**: Stores Access Logs, Record Hashes, and Doctor Credentials.

4.  **Shared (`/shared`)**:
    *   TypeScript interfaces and utility functions used across the stack.

## Workflow

1.  **Offline**: Doctor treats patient. Record created on tablet. Stored in `RxDB`.
2.  **Connect**: Tablet walks into range of **Regional Node** Wi-Fi.
3.  **Sync**: `RxDB` replicates to Regional Node.
4.  **Anchor**: Regional Node validates signature -> Uploads Blob to IPFS -> Writes `Hash` to Blockchain.
5.  **Verify**: Next doctor checks Blockchain `Hash` against retrieved record to ensure no tampering.
