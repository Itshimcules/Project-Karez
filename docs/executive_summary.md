# Afghanistan Medical Records (AMR) - Executive Summary

## The Challenge
Direct healthcare in Afghanistan faces a critical logistical hurdle: **Information Continuity**.
In a region with:
1.  **Intermittent Internet**: Hospitals cannot rely on cloud-based systems like those in the West.
2.  **Lackluster Infrastructure**: Frequent power outages and lack of centralized servers.
3.  **Displaced Populations**: Patients often move between clinics without physical medical records, leading to dangerous gaps in medical history (e.g., unknown allergies, duplicate vaccinations, conflicting prescriptions).

## The Solution: A "Store-and-Forward" Blockchain System
We have designed a system specifically for these constraints. It acts like a "Digital Medical Backpack" that follows the patient, but is secured by a national network.

### How it Works (Simply Put)
1.  **The "Offline-First" Tablet Application**:
    *   Doctors use a tablet that **does not need the internet** to work.
    *   When a patient arrives, the doctor scans their fingerprint (or enters a unique ID) and opens their request.
    *   The doctor types in the diagnosis and treatment.
    *   The tablet saves this data **locally** on its own hard drive, encrypted so only doctors can read it.

2.  **The "Sync" Moment**:
    *   Later, when the tablet connects to Wi-Fi (maybe once a day, or when the doctor travels to a regional center), it automatically sends all the new records to a standard server (Regional Node).
    *   Think of this like sending an email: you write it while offline, and it flies out the moment you get a signal.

3.  **The Blockchain (The "Truth" Layer)**:
    *   Instead of putting private medical details on the public web, we only put a **digital fingerprint (hash)** of the record on a Blockchain.
    *   **Why?** This prevents fraud. If a corrupt official tries to change a record back in time (e.g., to fake a vaccination supply), the Blockchain will reject it because the "fingerprint" won't match.
    *   This creates an incorruptible history of events without exposing patient secrets.

### Key Benefits
*   **Resilience**: Works even if the internet is down for weeks.
*   **Privacy**: Patient names and details are encrypted. Even if someone steals the tablet, they cannot read the files without the secure keys.
*   **Trust**: International donors (WHO, UN) can verify that medical aid is actually being delivered by looking at the Blockchain volume, ensuring transparency in aid distribution.

## Future Roadmap
1.  **Phase 1 (Prototype)**: Current status. Simulates the offline recording and syncing.
2.  **Phase 2 (Pilot)**: Deploy to 1 hospital and 3 rural clinics in a single province.
3.  **Phase 3 (National ID Integration)**: Link with biometric e-Tazkira (National ID) cards.
