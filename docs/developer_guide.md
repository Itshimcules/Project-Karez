# Afghanistan Medical Records (AMR) - Developer Guide

## System Architecture

The system is a **Hybrid Offline-First Distributed Application**.

### 1. The Trinity of Components
The codebase is a monorepo divided into three workspaces:

1.  **`mobile-app` (React Native)**:
    *   **Responsibility**: Data Entry & Encryption.
    *   **Key File**: `src/OfflineManager.ts`
        *   Implements a "Command Queue" pattern.
        *   Records are stored in `AsyncStorage` with `status: 'PENDING'`.
        *   `syncNow()` iterates pending records and pushes them to the Regional Node.
    *   **Security**: Data is encrypted using the Patient's Public Key (simulated in prototype) *before* storage.

2.  **`regional-node` (Node.js/Express)**:
    *   **Responsibility**: Gateway & Validation.
    *   **Key File**: `src/index.ts`
    *   **Workflow**:
        *   Receives `EncryptedBlob` + `Signature` from Mobile.
        *   Validates the Signature (Auth Mock).
        *   **IPFS Pinning**: Uploads the blob to IPFS (Simulated by generating a CID).
        *   **Blockchain Write**: Submits the `SHA-256` hash of the blob to the Smart Contract.

3.  **`blockchain-network` (Solidity)**:
    *   **Responsibility**: Immutable Integrity Log.
    *   **Key File**: `contracts/MedicalRecordRegistry.sol`
    *   **Data Structure**:
        ```solidity
        struct RecordLog {
            bytes32 dataHash;      // The "CheckSum" of the medical file
            bytes32 patientIdHash; // Privacy-preserving ID
            uint256 timestamp;
            address signerNode;    // Which clinic submitted this?
        }
        ```

## Code Deep Dive

### Shared Data Models
Look at `amr-system/shared/types.ts`. This file is the "Contract" between the Front-end and Back-end.
*   `MedicalRecord`: The main object passed around.
*   `SyncStatus`: ('PENDING' -> 'SYNCED' -> 'VERIFIED').

### The Offline Sync Logic (`OfflineManager.ts`)
This is the heart of the resilience strategy.
```typescript
async syncNow() {
    // 1. Find all PENDING records
    // 2. Try POST /sync/records
    // 3. If Success -> Mark SYNCED
    // 4. If Fail -> Do nothing (Keep in queue for retry)
}
```

### Encryption Strategy (Proposed)
In production, we use **Hybrid Encryption**:
1.  Generate a random AES symmetric key for the record.
2.  Encrypt the Record Data with the AES key.
3.  Encrypt the AES key with the Patient's Public Key (ECC/RSA).
4.  Store: `[EncryptedData] + [EncryptedKey]`.

## Getting Started
1.  **Install**: `npm install` in root.
2.  **Run Backend**: `npm run start:node`.
3.  **Run Mobile**: `cd mobile-app && npm start`.
