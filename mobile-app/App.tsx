import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert } from 'react-native';
import { OfflineManager } from './src/OfflineManager';
import { MedicalRecord } from '../shared/types';

export default function App() {
    const [patientId, setPatientId] = useState('');
    const [medicalData, setMedicalData] = useState('');
    const [offlineManager] = useState(new OfflineManager());
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Poll for status updates
        const interval = setInterval(async () => {
            const count = await offlineManager.getPendingCount();
            setPendingCount(count);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateRecord = async () => {
        if (!patientId || !medicalData) return;
        try {
            await offlineManager.createRecord(patientId, medicalData);
            setPatientId('');
            setMedicalData('');
            Alert.alert('Success', 'Record saved locally. Will sync when online.');
        } catch (e) {
            Alert.alert('Error', 'Failed to save record.');
        }
    };

    const forceSync = async () => {
        const success = await offlineManager.syncNow();
        if (success) {
            Alert.alert('Sync Complete', 'All records uploaded to Regional Node.');
        } else {
            Alert.alert('Sync Failed', 'Could not reach Regional Node. Data remains safe locally.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>AMR Offline Client</Text>
            <View style={styles.status}>
                <Text>Status: {pendingCount} records pending sync</Text>
            </View>

            <View style={styles.form}>
                <Text>Patient ID (Hash):</Text>
                <TextInput
                    style={styles.input}
                    value={patientId}
                    onChangeText={setPatientId}
                    placeholder="e.g. 8f7d..."
                />

                <Text>Medical Notes:</Text>
                <TextInput
                    style={styles.input}
                    value={medicalData}
                    onChangeText={setMedicalData}
                    multiline
                    placeholder="Diagnosis details..."
                />

                <Button title="Save Record (Offline)" onPress={handleCreateRecord} />
            </View>

            <View style={styles.sync}>
                <Button title="Sync Now (Connect to Wi-Fi)" onPress={forceSync} color="#f194ff" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    status: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    form: {
        width: '80%',
        gap: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    sync: {
        marginTop: 30,
        width: '80%'
    }
});
