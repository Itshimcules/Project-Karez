// Shared interfaces for Afghanistan Medical Blockchain

/**
 * Represents the integrity level of the record.
 * - PENDING: Stored locally, not yet synced.
 * - SYNCED: Uploaded to Regional Node.
 * - VERIFIED: Hash confirmed on Blockchain.
 */
export type SyncStatus = 'PENDING' | 'SYNCED' | 'VERIFIED';

/**
 * Basic immutable identity traits.
 * In a real scenario, 'id' is derived from a biometric hash.
 */
export interface PatientIdentity {
    id: string; // DID (Decentralized ID) or Biometric Hash
    publicKey: string; // For verifying signatures
}

/**
 * Detailed Patient Profile.
 * Stored off-chain, encrypted.
 */
export interface PatientProfile extends PatientIdentity {
    encryptedName: string; // AES encrypted
    encryptedAge: string;  // AES encrypted
    bloodType?: string;    // Could be public if non-identifiable, but safer encrypted
}

/**
 * The core medical record unit.
 * Optimized for offline storage.
 */
export interface MedicalRecord {
    recordId: string;       // CS256 UUID
    patientId: string;      // Link to Patient
    doctorId: string;       // Signer
    clinicId: string;       // Location context
    timestamp: number;

    // The actual medical data (Treatment, Diagnosis, Prescriptions)
    // This is a JSON string stringified and encrypted with the Patient's Public Key (or shared key)
    encryptedDataBlob: string;

    // Integrity check
    dataHash: string;       // SHA-256 of the unencrypted data
    signature: string;      // Signed by Doctor's Private Key

    // Sync metadata
    status: SyncStatus;
    ipfsCID?: string;       // Populated after sync
    txHash?: string;        // Blockchain transaction receipt
}

/**
 * Payload sent to the Blockchain.
 * Minimal data to ensure privacy.
 */
export interface BlockchainRecordLog {
    recordHash: string;     // The 'dataHash' from MedicalRecord
    patientIdHash: string;  // Hashed version of Patient ID (double blind)
    timestamp: number;
    registrySig: string;    // Signature of the Regional Node verifying it saw the data
}
