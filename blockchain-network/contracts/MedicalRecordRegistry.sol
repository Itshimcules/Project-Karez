// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MedicalRecordRegistry
 * @dev Stores hashes of medical records for integrity verification.
 * No PII is stored here.
 */
contract MedicalRecordRegistry {
    
    struct RecordLog {
        bytes32 dataHash;      // SHA-256 of the content
        bytes32 patientIdHash; // SHA-256 of the Patient ID (Privacy layer)
        uint256 timestamp;
        address signerNode;    // Which Regional Node submitted this?
    }

    // Maps recordHash to its log
    mapping(bytes32 => RecordLog) public records;
    
    // Whitelist of authorized Regional Nodes (Clinics/Hospitals)
    mapping(address => bool) public authorizedNodes;
    
    address public admin;

    event RecordAdded(bytes32 indexed recordHash, uint256 timestamp);

    modifier onlyAuthorized() {
        require(authorizedNodes[msg.sender], "Not an authorized Regional Node");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedNodes[msg.sender] = true; // Admin is also a node for testing
    }

    function authorizeNode(address _node) external {
        require(msg.sender == admin, "Only admin");
        authorizedNodes[_node] = true;
    }

    /**
     * @dev Anchors a record hash to the blockchain.
     */
    function addRecordLog(bytes32 _dataHash, bytes32 _patientIdHash) external onlyAuthorized {
        require(records[_dataHash].timestamp == 0, "Record already exists");

        records[_dataHash] = RecordLog({
            dataHash: _dataHash,
            patientIdHash: _patientIdHash,
            timestamp: block.timestamp,
            signerNode: msg.sender
        });

        emit RecordAdded(_dataHash, block.timestamp);
    }

    function verifyRecord(bytes32 _dataHash) external view returns (bool, uint256, address) {
        RecordLog memory log = records[_dataHash];
        if (log.timestamp == 0) {
            return (false, 0, address(0));
        }
        return (true, log.timestamp, log.signerNode);
    }
}
