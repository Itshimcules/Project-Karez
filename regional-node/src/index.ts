import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MedicalRecord, SyncStatus, BlockchainRecordLog } from '../shared/types';
import * as crypto from 'crypto';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for prototype
const recordStore: Record<string, MedicalRecord> = {};
const blockchainLog: BlockchainRecordLog[] = [];

// Middleware to simulate authentication
const authorizedNodeMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // In real world, verify TLS certs or JWT from Government Authority
    next();
};

/**
 * Endpoint for Mobile Apps to Sync Data
 * Simulates the "Walk into Clinic Wi-Fi" scenario.
 */
app.post('/sync/records', authorizedNodeMiddleware, async (req, res) => {
    const rawRecords = req.body as MedicalRecord[];
    console.log(`[SYNC] Received ${rawRecords.length} records.`);

    const processedResults = rawRecords.map(record => {
        // 1. Verify Signature (Mock)
        // const isValid = verifySignature(record.dataHash, record.signature, record.doctorId);

        // 2. Store Locally (RxDB replication target equivalent)
        record.status = 'SYNCED';
        recordStore[record.recordId] = record;

        // 3. Pin to IPFS (Simulated)
        const ipfsCid = `QmSimulated_${crypto.randomBytes(4).toString('hex')}`;
        record.ipfsCID = ipfsCid;

        // 4. Submit Hash to Blockchain (Simulated)
        const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
        record.txHash = txHash;

        // Log to "Blockchain"
        blockchainLog.push({
            recordHash: record.dataHash,
            patientIdHash: crypto.createHash('sha256').update(record.patientId).digest('hex'),
            timestamp: Date.now(),
            registrySig: 'sys_signature'
        });

        return {
            recordId: record.recordId,
            status: 'VERIFIED',
            ipfsCID: ipfsCid,
            txHash: txHash
        };
    });

    res.json({ success: true, results: processedResults });
});

/**
 * Public Endpoint to verify validity
 */
app.get('/verify/:recordHash', (req, res) => {
    const found = blockchainLog.find(l => l.recordHash === req.params.recordHash);
    if (found) {
        res.json({ valid: true, timestamp: found.timestamp });
    } else {
        res.json({ valid: false });
    }
});

app.listen(PORT, () => {
    console.log(`Regional Node running on http://localhost:${PORT}`);
    console.log(`[INFO] Mode: Offline-First Gateway`);
});
