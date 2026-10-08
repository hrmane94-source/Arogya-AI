import { collection, getDocs, doc, setDoc, query, limit } from 'firebase/firestore';
import { db } from './config';
import { Bed, AppointmentRecord, AuditLogRecord } from '../types/hospital';
import { INITIAL_BILLINGS } from '../data/doctorsAndBilling';

export async function ensureInitialDataSeeded() {
  try {
    const bedsCol = collection(db, 'beds');
    const existing = await getDocs(query(bedsCol, limit(1)));

    if (!existing.empty) {
      return; // Already seeded
    }

    console.log('Seeding initial Firestore hospital data...');

    // 1. Seed 30 Hospital Beds across Departments
    const initialBeds: Bed[] = [
      // ICU (Total 20, 18 occupied = 90%)
      { id: 'icu-01', code: 'ICU-01', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'OCCUPIED', patientName: 'Sanjay Deshmukh', acuity: 'CRITICAL', doctor: 'Dr. Aditi Sen', admissionDate: '05 Oct 2026' },
      { id: 'icu-02', code: 'ICU-02', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'OCCUPIED', patientName: 'Nisha Pillai', acuity: 'CRITICAL', doctor: 'Dr. Aditi Sen', admissionDate: '06 Oct 2026' },
      { id: 'icu-03', code: 'ICU-03', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'AVAILABLE', acuity: 'STABLE', doctor: 'Dr. Aditi Sen' },
      { id: 'icu-04', code: 'ICU-04', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'DISCHARGING', patientName: 'Kavita Joshi', acuity: 'SERIOUS', doctor: 'Dr. Rajesh Sharma', admissionDate: '04 Oct 2026' },
      { id: 'icu-05', code: 'ICU-05', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'CLEANING', cleaningProgressMinutes: 12 },
      { id: 'icu-06', code: 'ICU-06', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'OCCUPIED', patientName: 'Vikram Desai', acuity: 'CRITICAL', doctor: 'Dr. Aditi Sen', admissionDate: '07 Oct 2026' },
      { id: 'icu-07', code: 'ICU-07', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'OCCUPIED', patientName: 'Meena Saxena', acuity: 'SERIOUS', doctor: 'Dr. Aditi Sen', admissionDate: '06 Oct 2026' },
      { id: 'icu-08', code: 'ICU-08', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'RESERVED', patientName: 'Incoming ER Trauma', acuity: 'CRITICAL', doctor: 'Dr. Rajesh Sharma' },
      { id: 'icu-09', code: 'ICU-09', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'OCCUPIED', patientName: 'Anil Kapoor', acuity: 'CRITICAL', doctor: 'Dr. Aditi Sen', admissionDate: '07 Oct 2026' },
      { id: 'icu-10', code: 'ICU-10', wardId: 'ward-icu', wardName: 'Intensive Care Unit (ICU)', status: 'AVAILABLE', acuity: 'STABLE' },

      // CCU (Cardiac Care Unit)
      { id: 'ccu-01', code: 'CCU-01', wardId: 'ward-ccu', wardName: 'Cardiac Care Unit (CCU)', status: 'OCCUPIED', patientName: 'Ramesh Iyer', acuity: 'SERIOUS', doctor: 'Dr. Rajesh Sharma', admissionDate: '07 Oct 2026' },
      { id: 'ccu-02', code: 'CCU-02', wardId: 'ward-ccu', wardName: 'Cardiac Care Unit (CCU)', status: 'OCCUPIED', patientName: 'Amit Shah', acuity: 'CRITICAL', doctor: 'Dr. Rajesh Sharma', admissionDate: '07 Oct 2026' },
      { id: 'ccu-03', code: 'CCU-03', wardId: 'ward-ccu', wardName: 'Cardiac Care Unit (CCU)', status: 'AVAILABLE', acuity: 'STABLE' },
      { id: 'ccu-04', code: 'CCU-04', wardId: 'ward-ccu', wardName: 'Cardiac Care Unit (CCU)', status: 'DISCHARGING', patientName: 'Neha Kapoor', acuity: 'STABLE', doctor: 'Dr. Rajesh Sharma', admissionDate: '05 Oct 2026' },
      { id: 'ccu-05', code: 'CCU-05', wardId: 'ward-ccu', wardName: 'Cardiac Care Unit (CCU)', status: 'CLEANING', cleaningProgressMinutes: 5 },

      // Emergency Trauma
      { id: 'em-01', code: 'EM-01', wardId: 'ward-emer', wardName: 'Emergency & Trauma Holding', status: 'AVAILABLE', acuity: 'STABLE' },
      { id: 'em-02', code: 'EM-02', wardId: 'ward-emer', wardName: 'Emergency & Trauma Holding', status: 'OCCUPIED', patientName: 'Devendra Patel', acuity: 'CRITICAL', doctor: 'Dr. Priya V.', admissionDate: '08 Oct 2026' },
      { id: 'em-03', code: 'EM-03', wardId: 'ward-emer', wardName: 'Emergency & Trauma Holding', status: 'OCCUPIED', patientName: 'Sunil Rao', acuity: 'SERIOUS', doctor: 'Dr. Priya V.', admissionDate: '08 Oct 2026' },
      { id: 'em-04', code: 'EM-04', wardId: 'ward-emer', wardName: 'Emergency & Trauma Holding', status: 'RESERVED', patientName: 'En-route Ambulance 108', acuity: 'CRITICAL' },
      { id: 'em-05', code: 'EM-05', wardId: 'ward-emer', wardName: 'Emergency & Trauma Holding', status: 'AVAILABLE', acuity: 'STABLE' },

      // General Ward
      { id: 'gw-01', code: 'GW-01', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'AVAILABLE' },
      { id: 'gw-02', code: 'GW-02', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'OCCUPIED', patientName: 'Ananya Rao', acuity: 'STABLE', doctor: 'Dr. Rajesh Sharma' },
      { id: 'gw-03', code: 'GW-03', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'OCCUPIED', patientName: 'Manoj Verma', acuity: 'STABLE', doctor: 'Dr. Aditi Sen' },
      { id: 'gw-04', code: 'GW-04', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'DISCHARGING', patientName: 'Rachna Nair', acuity: 'STABLE' },
      { id: 'gw-05', code: 'GW-05', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'AVAILABLE' },
      { id: 'gw-06', code: 'GW-06', wardId: 'ward-gen', wardName: 'General Medical-Surgical', status: 'CLEANING', cleaningProgressMinutes: 10 },

      // Pediatrics
      { id: 'ped-01', code: 'PED-01', wardId: 'ward-ped', wardName: 'Pediatric Care Unit', status: 'AVAILABLE' },
      { id: 'ped-02', code: 'PED-02', wardId: 'ward-ped', wardName: 'Pediatric Care Unit', status: 'OCCUPIED', patientName: 'Master Aarav Jain (6y)', acuity: 'STABLE', doctor: 'Dr. Ritu Verma' },
      { id: 'ped-03', code: 'PED-03', wardId: 'ward-ped', wardName: 'Pediatric Care Unit', status: 'OCCUPIED', patientName: 'Baby Siya (2y)', acuity: 'STABLE', doctor: 'Dr. Ritu Verma' },
      { id: 'ped-04', code: 'PED-04', wardId: 'ward-ped', wardName: 'Pediatric Care Unit', status: 'AVAILABLE' },

      // Maternity
      { id: 'mat-01', code: 'MAT-01', wardId: 'ward-mat', wardName: 'Maternity & Postnatal Wing', status: 'AVAILABLE' },
      { id: 'mat-02', code: 'MAT-02', wardId: 'ward-mat', wardName: 'Maternity & Postnatal Wing', status: 'OCCUPIED', patientName: 'Pooja Hegde', acuity: 'STABLE', doctor: 'Dr. Sunita Rao' }
    ];

    for (const b of initialBeds) {
      await setDoc(doc(db, 'beds', b.id), b);
    }

    // 2. Seed Initial Appointments
    const initialAppointments: AppointmentRecord[] = [
      {
        id: 'apt-101',
        patientId: 'pt-1042',
        patientName: 'Kavita Joshi',
        doctorId: 'doc-cardio-1',
        doctorName: 'Dr. Rajesh Sharma',
        department: 'Cardiology',
        date: '08 Oct 2026',
        time: '10:30 AM',
        tokenNumber: 'A034',
        status: 'UPCOMING',
        reason: 'Post-MI Follow-up & ECG Review',
        createdAt: '07 Oct 2026'
      },
      {
        id: 'apt-102',
        patientId: 'pt-1043',
        patientName: 'Rahul Patil',
        doctorId: 'doc-cardio-1',
        doctorName: 'Dr. Rajesh Sharma',
        department: 'Cardiology',
        date: '08 Oct 2026',
        time: '11:00 AM',
        tokenNumber: 'A035',
        status: 'IN_CONSULTATION',
        reason: 'Chest tightness & hypertension',
        createdAt: '07 Oct 2026'
      },
      {
        id: 'apt-103',
        patientId: 'pt-1044',
        patientName: 'Sneha More',
        doctorId: 'doc-gen-1',
        doctorName: 'Dr. Rajesh K. Sharma',
        department: 'General Medicine',
        date: '08 Oct 2026',
        time: '11:30 AM',
        tokenNumber: 'A036',
        status: 'UPCOMING',
        reason: 'High fever and viral workup',
        createdAt: '08 Oct 2026'
      },
      {
        id: 'apt-104',
        patientId: 'pt-1042',
        patientName: 'Kavita Joshi',
        doctorId: 'doc-gen-1',
        doctorName: 'Dr. Mehta',
        department: 'General Medicine',
        date: '02 Oct 2026',
        time: '11:00 AM',
        tokenNumber: 'A021',
        status: 'COMPLETED',
        reason: 'General blood work checkup',
        createdAt: '01 Oct 2026'
      },
      {
        id: 'apt-105',
        patientId: 'pt-1042',
        patientName: 'Kavita Joshi',
        doctorId: 'doc-derm-1',
        doctorName: 'Dr. Iyer',
        department: 'Dermatology',
        date: '18 Sep 2026',
        time: '02:30 PM',
        tokenNumber: 'D018',
        status: 'COMPLETED',
        reason: 'Allergic rash consultation',
        createdAt: '17 Sep 2026'
      }
    ];

    for (const a of initialAppointments) {
      await setDoc(doc(db, 'appointments', a.id), a);
    }

    // 3. Seed Live Queue Patients
    const initialQueue = [
      { id: 'q-1', tokenNumber: 'A034', patientName: 'Kavita Joshi', age: 58, gender: 'Female', reason: 'Follow-up', department: 'Cardiology', status: 'WAITING', queuePosition: 4, estimatedWaitMins: 22 },
      { id: 'q-2', tokenNumber: 'A035', patientName: 'Rahul Patil', age: 45, gender: 'Male', reason: 'Chest Pain', department: 'Cardiology', status: 'IN_CONSULTATION', queuePosition: 1, estimatedWaitMins: 0 },
      { id: 'q-3', tokenNumber: 'A036', patientName: 'Sneha More', age: 32, gender: 'Female', reason: 'Routine Check', department: 'General Medicine', status: 'WAITING', queuePosition: 2, estimatedWaitMins: 10 },
      { id: 'q-4', tokenNumber: 'A037', patientName: 'Amit Shah', age: 67, gender: 'Male', reason: 'Breathlessness', department: 'Cardiology', status: 'WAITING', queuePosition: 3, estimatedWaitMins: 16 },
      { id: 'q-5', tokenNumber: 'A038', patientName: 'Priya Iyer', age: 29, gender: 'Female', reason: 'Review', department: 'Dermatology', status: 'WAITING', queuePosition: 5, estimatedWaitMins: 28 }
    ];

    for (const q of initialQueue) {
      await setDoc(doc(db, 'queue', q.id), q);
    }

    // 4. Seed Capacity Alerts
    const initialAlerts = [
      {
        id: 'alert-icu-01',
        severity: 'CRITICAL',
        department: 'Intensive Care Unit (ICU)',
        title: 'ICU Capacity Shortage Projected in 9 Hours',
        description: 'Ensemble trajectory forecasts ICU occupancy reaching 95% threshold by 01:45 AM. 236 beds total demand projected hospital-wide.',
        leadTimeHours: 9.2,
        actionRequired: 'Prepare 2 ICU step-down beds & review eligible step-down discharges.',
        status: 'ACTIVE',
        timestamp: '10:24 AM'
      },
      {
        id: 'alert-er-02',
        severity: 'WARNING',
        department: 'Emergency & Trauma Holding',
        title: 'Emergency Surge Influx (Ambulance Cluster)',
        description: 'Highway multi-vehicle accident diversion projected to deliver 4 acute admissions within 60 minutes.',
        leadTimeHours: 1.0,
        actionRequired: 'Prepare 6 additional holding beds & mobilize rapid housekeeping in PACU.',
        status: 'ACTIVE',
        timestamp: '10:18 AM'
      }
    ];

    for (const alt of initialAlerts) {
      await setDoc(doc(db, 'alerts', alt.id), alt);
    }

    // 5. Seed Billing Records from initial data
    for (const b of INITIAL_BILLINGS) {
      await setDoc(doc(db, 'billing', b.invoiceId), b);
    }

    // 6. Seed Audit Logs
    const initialAuditLogs: AuditLogRecord[] = [
      { id: 'log-1', action: 'FORECAST_RUN', actor: 'Arogya BedPredictor v1.0', role: 'SYSTEM', entity: 'FORECAST_ENGINE', details: 'Forecast job completed successfully (MAE: 4.12 beds, 24h horizon)', timestamp: '10:24:12 AM' },
      { id: 'log-2', action: 'APPOINTMENT_CREATE', actor: 'Patient Portal (Kavita Joshi)', role: 'PATIENT', entity: 'APPOINTMENT', details: 'New appointment created Token #A034 with Dr. Rajesh Sharma', timestamp: '10:18:03 AM' },
      { id: 'log-3', action: 'BED_STATUS_UPDATE', actor: 'Meera Patel', role: 'STAFF', entity: 'BED', details: 'Bed status updated (ICU-04 -> DISCHARGING, cleaning pending)', timestamp: '10:12:45 AM' },
      { id: 'log-4', action: 'BILL_PDF_GENERATED', actor: 'Billing Directorate', role: 'STAFF', entity: 'BILLING', details: 'PDF generated Bill #INV-1042 for Kavita Joshi (100% PM-JAY Cashless)', timestamp: '10:05:21 AM' },
      { id: 'log-5', action: 'MODEL_PREDICTION', actor: 'Arogya XGBoost Net v4.2', role: 'SYSTEM', entity: 'ML_ENGINE', details: 'Model inference generated: Inflow +42 Adm vs -31 Disch', timestamp: '10:01:03 AM' }
    ];

    for (const l of initialAuditLogs) {
      await setDoc(doc(db, 'auditLogs', l.id), l);
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.warn('Initial data seeding notice:', err);
  }
}
