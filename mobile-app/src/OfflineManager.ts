import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalRecord, SyncStatus } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid'; // Simulating uuid
import * as crypto from 'crypto'; // Note: In RN you'd use expo-crypto

const STORAGE_KEY = '@amr_records';
const REGIONAL_NODE_URL = 'http://localhost:3000/sync/records';

/**
 * Manages local storage and synchronization of records.
 * Follows the "Offline First" philosophy.
 */
export class OfflineManager {

    /**
     * Create a new record and store it locally immediately.
     */
    async createRecord(patientId: string, plainTextData: string): Promise<MedicalRecord> {
        // 1. Encrypt Data (Mock)
        const encryptedDataBlob = Buffer.from(plainTextData).toString('base64');
        const dataHash = 'hash_' + Math.random().toString(36); // Mock SHA256

        const newRecord: MedicalRecord = {
            recordId: Date.now().toString(), // Simple ID
            patientId,
            doctorId: 'doc_123',
            clinicId: 'clinic_kabul_1',
            timestamp: Date.now(),
            encryptedDataBlob,
            dataHash,
            signature: 'sig_mock',
            status: 'PENDING'
        };

        await this.saveLocally(newRecord);
        return newRecord;
    }

    /**
     * Internal helper to append to Async Storage
     */
    private async saveLocally(record: MedicalRecord) {
        const existing = await this.getAllRecords();
        existing.push(record);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    async getAllRecords(): Promise<MedicalRecord[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    }

    async getPendingCount(): Promise<number> {
        const records = await this.getAllRecords();
        return records.filter(r => r.status === 'PENDING').length;
    }

    /**
     * Attempts to upload all PENDING records to the server.
     */
    async syncNow(): Promise<boolean> {
        try {
            const allRecords = await this.getAllRecords();
            const pending = allRecords.filter(r => r.status === 'PENDING');

            if (pending.length === 0) return true;

            // Attempt upload
            const response = await fetch(REGIONAL_NODE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pending)
            });

            if (response.ok) {
                // Mark as SYNCED
                const updatedRecords = allRecords.map(r => {
                    if (r.status === 'PENDING') {
                        return { ...r, status: 'SYNCED' as SyncStatus };
                    }
                    return r;
                });
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
                return true;
            }
            return false;
        } catch (error) {
            console.log('Sync failed (expected if offline):', error);
            return false;
        }
    }
}
