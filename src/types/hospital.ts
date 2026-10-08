export type Role = 'ADMIN' | 'BED_MANAGER' | 'DOCTOR' | 'EMERGENCY_CHIEF';

export type ShortageSeverity = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'DISCHARGING' | 'CLEANING' | 'RESERVED';

export interface Bed {
  id: string;
  code: string;
  wardId: string;
  wardName: string;
  status: BedStatus;
  patientName?: string;
  admissionDate?: string;
  expectedDischarge?: string;
  acuity?: 'CRITICAL' | 'SERIOUS' | 'STABLE';
  doctor?: string;
  cleaningProgressMinutes?: number;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  totalBeds: number;
  occupiedBeds: number;
  cleaningBeds: number;
  reservedBeds: number;
  availableBeds: number;
  predictedDemand24h: number;
  expectedAdmissions: number;
  expectedDischarges: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  alos: number; // Average Length of Stay in days
  turnaroundMins: number;
  color: string;
}

export interface ForecastPoint {
  timestamp: string;
  label: string;
  historical?: number;
  predicted?: number;
  lowerConfidence?: number;
  upperConfidence?: number;
  capacity: number;
  admissions: number;
  discharges: number;
  isCurrent?: boolean;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  category: 'DISCHARGE' | 'PREPARE_BEDS' | 'REVIEW_ELECTIVE' | 'STEP_DOWN';
  impactDescription: string;
  status: 'PENDING' | 'EXECUTED';
  actionLabel: string;
}

export interface EarlyWarningAlert {
  id: string;
  title: string;
  ward: string;
  severity: ShortageSeverity;
  timeframe: string;
  etaHours: number;
  currentOccupancyPct: number;
  projectedOccupancyPct: number;
  expectedAdmissions: number;
  expectedDischarges: number;
  description: string;
  actions: RecommendedAction[];
  acknowledged: boolean;
}

export interface TriagePatient {
  id: string;
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: string;
  esiLevel: 1 | 2 | 3 | 4 | 5; // 1 = Immediate Resuscitation, 5 = Non-urgent
  chiefComplaint: string;
  arrivalTime: string;
  predictedWaitMins: number;
  assignedWardTarget: string;
  status: 'WAITING' | 'IN_TRIAGE' | 'WITH_PHYSICIAN' | 'BED_ALLOCATED';
  govCardScheme?: string;
  govCardNumber?: string;
  concessionApplied?: boolean;
  concessionPercent?: number;
}

export interface GovCardScheme {
  id: string;
  name: string;
  badge: string;
  type: 'AYUSHMAN_BHARAT' | 'ABHA' | 'CGHS' | 'MEDICARE' | 'STATE_BPL';
  bedConcessionRate: number; // e.g. 100% or 80%
  icuConcessionRate: number;
  annualCoverage: string;
  verificationIssuer: string;
  sampleNumber: string;
}

export interface TokenConcessionSlip {
  tokenNumber: string;
  patientName: string;
  age: number;
  schemeName: string;
  cardNumber: string;
  triagePriority: string;
  targetWard: string;
  assignedBed: string;
  standardDailyBedFee: number;
  concessionDiscountPct: number;
  netPayableDaily: number;
  issuedAt: string;
  validUntil: string;
  authCode: string;
}

export interface MLModelMetric {
  name: string;
  type: string;
  mae: number;
  rmse: number;
  r2: number;
  latencyMs: number;
  status: 'ACTIVE_DEPLOYED' | 'BENCHMARKED' | 'SHADOW';
  description: string;
}

export type DoctorSpecialty = 
  | 'DERMATOLOGIST' 
  | 'PEDIATRICIAN' 
  | 'GYNECOLOGIST' 
  | 'GENERAL_PHYSICIAN' 
  | 'CARDIOLOGIST' 
  | 'ORTHOPEDIC';

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: DoctorSpecialty;
  specialtyLabel: string;
  qualification: string;
  experienceYears: number;
  opdRoom: string;
  consultationTiming: string;
  currentQueueCount: number;
  estWaitMins: number;
  treatingConditions: string[];
  availableToday: boolean;
  rating: number;
}

export interface BillingItem {
  id: string;
  description: string;
  category: 'BED' | 'CONSULTATION' | 'LAB' | 'PHARMACY' | 'NURSING' | 'EQUIPMENT';
  quantity: number;
  ratePerUnit: number;
  total: number;
}

export interface PatientBillingRecord {
  invoiceId: string;
  patientId: string;
  patientName: string;
  tokenNumber: string;
  age: number;
  gender: string;
  mobile: string;
  admittedWard: string;
  bedNumber: string;
  attendingDoctor: string;
  specialty: string;
  admissionDate: string;
  dischargeDate: string;
  stayDays: number;
  items: BillingItem[];
  subtotal: number;
  govSchemeName?: string;
  govCardNumber?: string;
  concessionDiscountPct: number;
  discountAmount: number;
  totalPayable: number;
  paymentStatus: 'PAID_CASHLESS' | 'PARTIALLY_SUBSIDIZED' | 'SETTLED' | 'PENDING';
  authCode: string;
}

