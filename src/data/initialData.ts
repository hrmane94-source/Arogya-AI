import { Ward, Bed, ForecastPoint, EarlyWarningAlert, GovCardScheme, TriagePatient, MLModelMetric } from '../types/hospital';

export const INITIAL_WARDS: Ward[] = [
  {
    id: 'ward-icu',
    name: 'Intensive Care Unit (ICU)',
    code: 'ICU',
    totalBeds: 20,
    occupiedBeds: 18,
    cleaningBeds: 1,
    reservedBeds: 1,
    availableBeds: 0,
    predictedDemand24h: 22,
    expectedAdmissions: 6,
    expectedDischarges: 2,
    riskLevel: 'CRITICAL',
    alos: 4.8,
    turnaroundMins: 45,
    color: '#f43f5e'
  },
  {
    id: 'ward-gen',
    name: 'General Medical-Surgical',
    code: 'GEN-MED',
    totalBeds: 180,
    occupiedBeds: 122,
    cleaningBeds: 6,
    reservedBeds: 5,
    availableBeds: 47,
    predictedDemand24h: 142,
    expectedAdmissions: 24,
    expectedDischarges: 18,
    riskLevel: 'HIGH',
    alos: 3.2,
    turnaroundMins: 25,
    color: '#06b6d4'
  },
  {
    id: 'ward-ped',
    name: 'Pediatric Care Unit',
    code: 'PED',
    totalBeds: 30,
    occupiedBeds: 22,
    cleaningBeds: 2,
    reservedBeds: 1,
    availableBeds: 5,
    predictedDemand24h: 26,
    expectedAdmissions: 4,
    expectedDischarges: 3,
    riskLevel: 'MODERATE',
    alos: 2.4,
    turnaroundMins: 30,
    color: '#10b981'
  },
  {
    id: 'ward-emg',
    name: 'Emergency & Trauma Holding',
    code: 'EMG-TR',
    totalBeds: 35,
    occupiedBeds: 25,
    cleaningBeds: 3,
    reservedBeds: 2,
    availableBeds: 5,
    predictedDemand24h: 33,
    expectedAdmissions: 18,
    expectedDischarges: 12,
    riskLevel: 'HIGH',
    alos: 0.8,
    turnaroundMins: 15,
    color: '#f59e0b'
  },
  {
    id: 'ward-ccu',
    name: 'Cardiac Care Unit (CCU)',
    code: 'CCU',
    totalBeds: 15,
    occupiedBeds: 12,
    cleaningBeds: 1,
    reservedBeds: 0,
    availableBeds: 2,
    predictedDemand24h: 14,
    expectedAdmissions: 3,
    expectedDischarges: 1,
    riskLevel: 'HIGH',
    alos: 3.9,
    turnaroundMins: 40,
    color: '#ec4899'
  },
  {
    id: 'ward-mat',
    name: 'Maternity & Neonatal',
    code: 'MAT-NEO',
    totalBeds: 20,
    occupiedBeds: 14,
    cleaningBeds: 1,
    reservedBeds: 1,
    availableBeds: 4,
    predictedDemand24h: 17,
    expectedAdmissions: 5,
    expectedDischarges: 4,
    riskLevel: 'LOW',
    alos: 2.1,
    turnaroundMins: 35,
    color: '#8b5cf6'
  }
];

// Helper to generate bed list with realistic metadata
export function generateInitialBeds(): Bed[] {
  const beds: Bed[] = [];
  INITIAL_WARDS.forEach((ward) => {
    for (let i = 1; i <= ward.totalBeds; i++) {
      const code = `${ward.code}-${String(i).padStart(2, '0')}`;
      let status: Bed['status'] = 'AVAILABLE';
      let patientName: string | undefined;
      let acuity: Bed['acuity'];
      let doctor: string | undefined;
      let expectedDischarge: string | undefined;
      let cleaningProgressMinutes: number | undefined;

      if (i <= ward.occupiedBeds - (ward.id === 'ward-gen' ? 12 : 2)) {
        status = 'OCCUPIED';
        patientName = `Pt. ${['Sharma', 'Patel', 'Verma', 'Khan', 'Deshmukh', 'Gupta', 'Rao', 'Singh', 'Mehta', 'Fernandes', 'Nair', 'Kulkarni'][i % 12]} (${42 + (i % 38)}y)`;
        acuity = ward.code.includes('ICU') || ward.code.includes('CCU') ? 'CRITICAL' : (i % 3 === 0 ? 'SERIOUS' : 'STABLE');
        doctor = ['Dr. Aditi Sen (Pulm)', 'Dr. Rajesh K (Cardio)', 'Dr. Neha V (Intensivist)', 'Dr. Vikram D (Surgery)'][i % 4];
      } else if (i <= ward.occupiedBeds) {
        status = 'DISCHARGING';
        patientName = `Pt. ${['Bose', 'Chatterjee', 'Iyer', 'Menon', 'Jadhav'][i % 5]} (${35 + (i % 30)}y)`;
        expectedDischarge = `${(i % 4) + 1}h remaining (Discharge papers ready)`;
        acuity = 'STABLE';
        doctor = 'Dr. Neha V (Intensivist)';
      } else if (i <= ward.occupiedBeds + ward.cleaningBeds) {
        status = 'CLEANING';
        cleaningProgressMinutes = 10 + (i * 3) % 20;
      } else if (i <= ward.occupiedBeds + ward.cleaningBeds + ward.reservedBeds) {
        status = 'RESERVED';
        patientName = `Inbound ER Transfer (ETA 15m)`;
      } else {
        status = 'AVAILABLE';
      }

      beds.push({
        id: `bed-${code}`,
        code,
        wardId: ward.id,
        wardName: ward.name,
        status,
        patientName,
        acuity,
        doctor,
        expectedDischarge,
        cleaningProgressMinutes
      });
    }
  });
  return beds;
}

// 7-Day & 24-Hour Forecast Points
export const FORECAST_SERIES_24H: ForecastPoint[] = [
  { timestamp: '-12h', label: '12h Ago', historical: 198, capacity: 300, admissions: 12, discharges: 14 },
  { timestamp: '-8h', label: '8h Ago', historical: 204, capacity: 300, admissions: 16, discharges: 10 },
  { timestamp: '-4h', label: '4h Ago', historical: 209, capacity: 300, admissions: 14, discharges: 9 },
  { timestamp: '0h', label: 'NOW', historical: 213, predicted: 213, lowerConfidence: 213, upperConfidence: 213, capacity: 300, admissions: 0, discharges: 0, isCurrent: true },
  { timestamp: '+3h', label: '+3h (2 PM)', predicted: 221, lowerConfidence: 217, upperConfidence: 226, capacity: 300, admissions: 15, discharges: 7 },
  { timestamp: '+6h', label: '+6h (5 PM)', predicted: 229, lowerConfidence: 223, upperConfidence: 235, capacity: 300, admissions: 16, discharges: 8 },
  { timestamp: '+9h', label: '+9h (8 PM)', predicted: 236, lowerConfidence: 229, upperConfidence: 244, capacity: 300, admissions: 14, discharges: 7 },
  { timestamp: '+14h', label: '+14h (1 AM)', predicted: 254, lowerConfidence: 245, upperConfidence: 263, capacity: 300, admissions: 22, discharges: 4 },
  { timestamp: '+18h', label: '+18h (5 AM)', predicted: 265, lowerConfidence: 254, upperConfidence: 275, capacity: 300, admissions: 14, discharges: 3 },
  { timestamp: '+24h', label: '+24h (11 AM)', predicted: 274, lowerConfidence: 262, upperConfidence: 286, capacity: 300, admissions: 28, discharges: 19 }
];

export const FORECAST_SERIES_7D: ForecastPoint[] = [
  { timestamp: 'D-3', label: 'Mon (Actual)', historical: 202, capacity: 300, admissions: 38, discharges: 34 },
  { timestamp: 'D-2', label: 'Tue (Actual)', historical: 208, capacity: 300, admissions: 41, discharges: 35 },
  { timestamp: 'D-1', label: 'Wed (Actual)', historical: 211, capacity: 300, admissions: 43, discharges: 40 },
  { timestamp: 'D0', label: 'Today (Live)', historical: 213, predicted: 213, lowerConfidence: 213, upperConfidence: 213, capacity: 300, admissions: 42, discharges: 31, isCurrent: true },
  { timestamp: 'D+1', label: 'Tomorrow', predicted: 274, lowerConfidence: 260, upperConfidence: 288, capacity: 300, admissions: 48, discharges: 26 },
  { timestamp: 'D+2', label: 'Saturday', predicted: 285, lowerConfidence: 268, upperConfidence: 298, capacity: 300, admissions: 52, discharges: 21 },
  { timestamp: 'D+3', label: 'Sunday', predicted: 292, lowerConfidence: 272, upperConfidence: 304, capacity: 300, admissions: 45, discharges: 18 },
  { timestamp: 'D+4', label: 'Monday', predicted: 281, lowerConfidence: 264, upperConfidence: 296, capacity: 300, admissions: 40, discharges: 35 },
  { timestamp: 'D+5', label: 'Tuesday', predicted: 262, lowerConfidence: 248, upperConfidence: 278, capacity: 300, admissions: 37, discharges: 44 },
  { timestamp: 'D+6', label: 'Wednesday', predicted: 245, lowerConfidence: 232, upperConfidence: 260, capacity: 300, admissions: 35, discharges: 41 },
  { timestamp: 'D+7', label: 'Thursday', predicted: 238, lowerConfidence: 224, upperConfidence: 252, capacity: 300, admissions: 33, discharges: 39 }
];

export const INITIAL_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'alert-1',
    title: 'ICU Capacity Threshold Breach Projected',
    ward: 'Intensive Care Unit (ICU)',
    severity: 'CRITICAL',
    timeframe: 'Within 14 Hours (Expected 1:45 AM)',
    etaHours: 14,
    currentOccupancyPct: 90,
    projectedOccupancyPct: 98,
    expectedAdmissions: 18,
    expectedDischarges: 7,
    description: 'ICU capacity is tracking to reach 95%+ within 14 hours. Inbound trauma surge and post-op cardiovascular cases will exceed physical bed limits without intervention.',
    acknowledged: false,
    actions: [
      {
        id: 'act-1',
        title: 'Prioritize discharge planning',
        description: 'Expedite 4 stable ICU step-down patients with LOS > 4 days to General Medical Ward 3A.',
        category: 'DISCHARGE',
        impactDescription: 'Frees 4 ICU beds within 3 hours',
        status: 'PENDING',
        actionLabel: 'Expedite Step-Down Patients'
      },
      {
        id: 'act-2',
        title: 'Prepare additional beds (Housekeeping)',
        description: 'Dispatch rapid environmental cleaning squad to ICU-03 and CCU-09. Mobilize 3 overflow telemetry beds.',
        category: 'PREPARE_BEDS',
        impactDescription: 'Adds 3 sanitized beds in 25 mins',
        status: 'PENDING',
        actionLabel: 'Dispatch Housekeeping Priority'
      },
      {
        id: 'act-3',
        title: 'Review elective admissions',
        description: 'Flag 5 non-emergency elective procedures scheduled for tomorrow 8 AM for review by Chief of Surgery.',
        category: 'REVIEW_ELECTIVE',
        impactDescription: 'Defers 5 bed reservations',
        status: 'PENDING',
        actionLabel: 'Flag 5 Elective Surgeries'
      },
      {
        id: 'act-4',
        title: 'Prepare ICU step-down capacity',
        description: 'Coordinate with CCU and High Dependency Unit (HDU) to reserve 2 bridge ventilators.',
        category: 'STEP_DOWN',
        impactDescription: 'Mitigates mechanical vent shortage',
        status: 'PENDING',
        actionLabel: 'Arm HDU Bridge Ventilators'
      }
    ]
  },
  {
    id: 'alert-2',
    title: 'General Ward Occupancy Rising Ahead of Weekend',
    ward: 'General Medical-Surgical',
    severity: 'WARNING',
    timeframe: 'Tomorrow 6:00 PM',
    etaHours: 24,
    currentOccupancyPct: 81,
    projectedOccupancyPct: 92,
    expectedAdmissions: 24,
    expectedDischarges: 18,
    description: 'General Ward occupancy projected to exceed 90% tomorrow evening due to reduced weekend discharge rate and scheduled ortho cases.',
    acknowledged: false,
    actions: [
      {
        id: 'act-5',
        title: 'Expedite pending pharmacy discharge slips',
        description: 'Notify hospital pharmacy to fast-track medication reconciliation for 12 candidate patients.',
        category: 'DISCHARGE',
        impactDescription: 'Clears 12 general beds by 2:00 PM',
        status: 'PENDING',
        actionLabel: 'Fast-Track Pharmacy Slips'
      },
      {
        id: 'act-6',
        title: 'Open Ward 4B Overflow Annex',
        description: 'Instruct facility management to activate 15 overflow beds in modular wing 4B.',
        category: 'PREPARE_BEDS',
        impactDescription: 'Increases capacity by 15 beds',
        status: 'PENDING',
        actionLabel: 'Activate Wing 4B Annex'
      }
    ]
  },
  {
    id: 'alert-3',
    title: 'Discharge Acceleration Opportunity',
    ward: 'Pediatric & General Medical',
    severity: 'OPPORTUNITY',
    timeframe: 'Next 6 Hours',
    etaHours: 6,
    currentOccupancyPct: 73,
    projectedOccupancyPct: 68,
    expectedAdmissions: 8,
    expectedDischarges: 16,
    description: '12 patients across Pediatric and General wards have met clinical stability benchmarks and are awaiting final physician sign-off.',
    acknowledged: false,
    actions: [
      {
        id: 'act-7',
        title: 'Trigger Physician Mobile Discharge Approvals',
        description: 'Send electronic batch sign-off notification to attending doctors on rounds.',
        category: 'DISCHARGE',
        impactDescription: 'Releases 12 beds 3.5 hours earlier',
        status: 'PENDING',
        actionLabel: 'Broadcast Batch Sign-Off'
      }
    ]
  }
];

export const GOV_CARD_SCHEMES: GovCardScheme[] = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    badge: 'PM-JAY Gold',
    type: 'AYUSHMAN_BHARAT',
    bedConcessionRate: 100, // 100% free general/ICU bed fee
    icuConcessionRate: 100,
    annualCoverage: '₹5,00,000 per family/yr',
    verificationIssuer: 'National Health Authority (NHA)',
    sampleNumber: 'AB-PMJAY-9042-8821'
  },
  {
    id: 'abha',
    name: 'ABHA Digital Health Card',
    badge: 'ABHA Verified',
    type: 'ABHA',
    bedConcessionRate: 75,
    icuConcessionRate: 70,
    annualCoverage: 'Ayushman Bharat Digital Mission (ABDM)',
    verificationIssuer: 'Ministry of Health & Family Welfare',
    sampleNumber: '91-4421-8930-1092'
  },
  {
    id: 'cghs',
    name: 'Central Govt Health Scheme (CGHS)',
    badge: 'CGHS Tier 1',
    type: 'CGHS',
    bedConcessionRate: 90,
    icuConcessionRate: 90,
    annualCoverage: 'Comprehensive Cashless Entitlement',
    verificationIssuer: 'Govt of India / CGHS Directorate',
    sampleNumber: 'CGHS-DEL-2024-5519'
  },
  {
    id: 'bpl',
    name: 'State BPL / Antyodaya Health Card',
    badge: 'BPL Concession',
    type: 'STATE_BPL',
    bedConcessionRate: 100,
    icuConcessionRate: 95,
    annualCoverage: '100% Subsidized Essential Care',
    verificationIssuer: 'State Department of Public Health',
    sampleNumber: 'BPL-MAH-8829-4110'
  },
  {
    id: 'medicare',
    name: 'Medicare / Medicaid Emergency Subsidy',
    badge: 'Global Scheme',
    type: 'MEDICARE',
    bedConcessionRate: 80,
    icuConcessionRate: 75,
    annualCoverage: 'Statutory Inpatient Hospital Part A',
    verificationIssuer: 'Federal Health Agency',
    sampleNumber: 'MCARE-981-44-209'
  }
];

export const INITIAL_QUEUE: TriagePatient[] = [
  {
    id: 'q-1',
    tokenNumber: 'BP-101',
    patientName: 'Kavita Joshi',
    age: 58,
    gender: 'Female',
    esiLevel: 1, // Resuscitation
    chiefComplaint: 'Acute myocardial infarction, ST elevation on EMS ECG',
    arrivalTime: '10 mins ago',
    predictedWaitMins: 0,
    assignedWardTarget: 'Cardiac Care Unit (CCU)',
    status: 'IN_TRIAGE',
    govCardScheme: 'Ayushman Bharat (PM-JAY)',
    govCardNumber: 'AB-PMJAY-9042-8821',
    concessionApplied: true,
    concessionPercent: 100
  },
  {
    id: 'q-2',
    tokenNumber: 'BP-102',
    patientName: 'Ramesh Sundaram',
    age: 44,
    gender: 'Male',
    esiLevel: 2, // Emergent
    chiefComplaint: 'Severe respiratory distress, SpO2 84%, COPD exacerbation',
    arrivalTime: '18 mins ago',
    predictedWaitMins: 4,
    assignedWardTarget: 'Intensive Care Unit (ICU)',
    status: 'WAITING',
    govCardScheme: 'ABHA Digital Health Card',
    govCardNumber: '91-4421-8930-1092',
    concessionApplied: true,
    concessionPercent: 75
  },
  {
    id: 'q-3',
    tokenNumber: 'BP-103',
    patientName: 'Ananya Deshmukh',
    age: 8,
    gender: 'Female',
    esiLevel: 3, // Urgent
    chiefComplaint: 'High febrile convulsion, dehydration, pediatric observation',
    arrivalTime: '25 mins ago',
    predictedWaitMins: 14,
    assignedWardTarget: 'Pediatric Care Unit',
    status: 'WAITING',
    govCardScheme: 'State BPL / Antyodaya Health Card',
    govCardNumber: 'BPL-MAH-8829-4110',
    concessionApplied: true,
    concessionPercent: 100
  },
  {
    id: 'q-4',
    tokenNumber: 'BP-104',
    patientName: 'Sunil Rao',
    age: 62,
    gender: 'Male',
    esiLevel: 3,
    chiefComplaint: 'Complicated acute appendicitis with localized peritoneal signs',
    arrivalTime: '34 mins ago',
    predictedWaitMins: 19,
    assignedWardTarget: 'General Medical-Surgical',
    status: 'WAITING',
    govCardScheme: 'Central Govt Health Scheme (CGHS)',
    govCardNumber: 'CGHS-DEL-2024-5519',
    concessionApplied: true,
    concessionPercent: 90
  },
  {
    id: 'q-5',
    tokenNumber: 'BP-105',
    patientName: 'Preeti Nair',
    age: 29,
    gender: 'Female',
    esiLevel: 4, // Less Urgent
    chiefComplaint: 'Closed forearm fracture, stable vitals, pain management',
    arrivalTime: '42 mins ago',
    predictedWaitMins: 32,
    assignedWardTarget: 'Emergency & Trauma Holding',
    status: 'WAITING'
  },
  {
    id: 'q-6',
    tokenNumber: 'BP-106',
    patientName: 'Mohd. Tariq',
    age: 51,
    gender: 'Male',
    esiLevel: 5, // Non-urgent
    chiefComplaint: 'Chronic knee arthralgia, request for elective inpatient MRI evaluation',
    arrivalTime: '50 mins ago',
    predictedWaitMins: 55,
    assignedWardTarget: 'General Medical-Surgical',
    status: 'WAITING'
  }
];

export const ML_MODELS_BENCHMARK: MLModelMetric[] = [
  {
    name: 'BedPulse XGBoost Surge Net (Ensemble)',
    type: 'Gradient Boosted Decision Trees + Lagged Hospital Covariates',
    mae: 4.12,
    rmse: 5.84,
    r2: 0.941,
    latencyMs: 18,
    status: 'ACTIVE_DEPLOYED',
    description: 'Trained on 3 years of multi-ward admissions, EMS dispatch feeds, holiday spikes, weather indices, and dynamic ALOS decay.'
  },
  {
    name: 'Prophet + Fourier Seasonal Hybrid',
    type: 'Generalized Additive Model with Holiday Regressors',
    mae: 6.45,
    rmse: 8.92,
    r2: 0.884,
    latencyMs: 42,
    status: 'BENCHMARKED',
    description: 'Effective for weekly macro cycles but exhibits lag in immediate 6-hour emergency room multi-casualty spikes.'
  },
  {
    name: 'Random Forest Regressor (100 Trees)',
    type: 'Bagged Ensemble with Bootstrap Aggregation',
    mae: 7.21,
    rmse: 9.75,
    r2: 0.862,
    latencyMs: 31,
    status: 'BENCHMARKED',
    description: 'Good baseline resistance to outlier noise, slightly underestimates extreme ICU saturation events.'
  },
  {
    name: 'Multiple Linear Regression (Baseline)',
    type: 'Ordinary Least Squares with Polynomial Features',
    mae: 14.80,
    rmse: 18.30,
    r2: 0.691,
    latencyMs: 4,
    status: 'BENCHMARKED',
    description: 'Simple baseline benchmark. Fails to capture nonlinear interaction between weekend discharge dips and emergency influx.'
  }
];
