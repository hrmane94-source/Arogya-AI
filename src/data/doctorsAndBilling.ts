import { DoctorProfile, PatientBillingRecord } from '../types/hospital';

export const INITIAL_DOCTORS: DoctorProfile[] = [
  // 1. Dermatologist (Dermat)
  {
    id: 'doc-dermat-1',
    name: 'Dr. Ritu Verma',
    specialty: 'DERMATOLOGIST',
    specialtyLabel: 'Dermatologist & Skin Specialist',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy - AIIMS Delhi)',
    experienceYears: 14,
    opdRoom: 'OPD Block C, Room 204 (Skin Clinic)',
    consultationTiming: '09:00 AM - 01:30 PM (Mon - Sat)',
    currentQueueCount: 7,
    estWaitMins: 14,
    treatingConditions: [
      'Eczema & Atopic Dermatitis',
      'Psoriasis & Scalp Flaking',
      'Severe Acne & Rosacea',
      'Fungal Infections & Ringworm',
      'Allergic Hives & Urticaria',
      'Hair Fall & Alopecia Areata'
    ],
    availableToday: true,
    rating: 4.9
  },
  {
    id: 'doc-dermat-2',
    name: 'Dr. Alok Mathur',
    specialty: 'DERMATOLOGIST',
    specialtyLabel: 'Dermatologist & Cosmetologist',
    qualification: 'MBBS, DVD, DNB (Dermatology)',
    experienceYears: 9,
    opdRoom: 'OPD Block C, Room 206',
    consultationTiming: '02:00 PM - 05:30 PM (Mon - Fri)',
    currentQueueCount: 4,
    estWaitMins: 10,
    treatingConditions: [
      'Bacterial Skin Infections & Boils',
      'Pigmentation & Melasma',
      'Contact Dermatitis',
      'Vitiligo Patch Care',
      'Nail Fungus & Ingrown Nails'
    ],
    availableToday: true,
    rating: 4.8
  },

  // 2. Pediatrician
  {
    id: 'doc-ped-1',
    name: 'Dr. Priya Iyer',
    specialty: 'PEDIATRICIAN',
    specialtyLabel: 'Senior Pediatrician & Child Specialist',
    qualification: 'MBBS, MD (Pediatrics), DCH (London), FIAP',
    experienceYears: 16,
    opdRoom: 'Mother & Child Wing, OPD 102',
    consultationTiming: '08:30 AM - 02:00 PM (Daily)',
    currentQueueCount: 9,
    estWaitMins: 18,
    treatingConditions: [
      'High Childhood Fevers & Infections',
      'Vaccination & Government Immunization',
      'Pediatric Asthma & Wheezing',
      'Infant Vomiting & Dehydration',
      'Growth & Nutritional Deficiencies',
      'Neonatal Jaundice Observation'
    ],
    availableToday: true,
    rating: 4.9
  },
  {
    id: 'doc-ped-2',
    name: 'Dr. Sanjay Bansal',
    specialty: 'PEDIATRICIAN',
    specialtyLabel: 'Neonatologist & Pediatric Critical Care',
    qualification: 'MBBS, MD (Pediatrics), Fellowship in Neonatology',
    experienceYears: 11,
    opdRoom: 'NICU & Child Block, Room 105',
    consultationTiming: '10:00 AM - 04:00 PM (Mon - Sat)',
    currentQueueCount: 5,
    estWaitMins: 12,
    treatingConditions: [
      'Newborn Critical Care (NICU follow-up)',
      'Pediatric Convulsions & Seizures',
      'Severe Respiratory Distress in Children',
      'Childhood Allergy & Food Intolerance',
      'Pediatric Gastrointestinal Infection'
    ],
    availableToday: true,
    rating: 4.8
  },

  // 3. Gynecologist & Obstetrician (Gynac)
  {
    id: 'doc-gyn-1',
    name: 'Dr. Sharmila Kulkarni',
    specialty: 'GYNECOLOGIST',
    specialtyLabel: 'Obstetrician & Gynecologist (Gynac)',
    qualification: 'MBBS, MS (Obstetrics & Gynaecology), FICOG',
    experienceYears: 18,
    opdRoom: 'Maternity Wing, OPD Room 301',
    consultationTiming: '09:00 AM - 02:30 PM (Mon - Sat)',
    currentQueueCount: 12,
    estWaitMins: 22,
    treatingConditions: [
      'Antenatal Care & Pregnancy Monitoring',
      'High-Risk Pregnancy & Pre-eclampsia',
      'PCOS / PCOD & Hormonal Imbalance',
      'Uterine Fibroids & Ovarian Cysts',
      'Normal Delivery & C-Section Planning',
      'Postnatal Recovery & Lactation Support'
    ],
    availableToday: true,
    rating: 4.9
  },
  {
    id: 'doc-gyn-2',
    name: 'Dr. Meenakshi Sundaram',
    specialty: 'GYNECOLOGIST',
    specialtyLabel: 'Gynecologist & Laparoscopic Surgeon',
    qualification: 'MBBS, DGO, DNB (ObGyn), Fellowship in Minimal Access',
    experienceYears: 12,
    opdRoom: 'Maternity Wing, OPD Room 303',
    consultationTiming: '01:00 PM - 06:00 PM (Mon - Sat)',
    currentQueueCount: 6,
    estWaitMins: 15,
    treatingConditions: [
      'Irregular Menstrual Cycles & Pain',
      'Pelvic Inflammatory Disease (PID)',
      'Menopause & Bone Density Counseling',
      'Cervical Cancer Screening (Pap Smear)',
      'Infertility Evaluation & Guidance'
    ],
    availableToday: true,
    rating: 4.7
  },

  // 4. General Physician
  {
    id: 'doc-gen-1',
    name: 'Dr. Rajesh K. Sharma',
    specialty: 'GENERAL_PHYSICIAN',
    specialtyLabel: 'Senior Consultant General Physician',
    qualification: 'MBBS, MD (General Medicine), FICP',
    experienceYears: 21,
    opdRoom: 'Central OPD Building, Room 101',
    consultationTiming: '08:00 AM - 02:00 PM (Daily)',
    currentQueueCount: 15,
    estWaitMins: 25,
    treatingConditions: [
      'Acute Viral Fevers, Dengue & Malaria',
      'Diabetes Mellitus & Blood Sugar Control',
      'High Blood Pressure (Hypertension)',
      'Chest Infections, Cough & Pneumonia',
      'Acid Reflux, Gastritis & Indigestion',
      'Weakness, Anemia & General Fatigue'
    ],
    availableToday: true,
    rating: 4.9
  },
  {
    id: 'doc-gen-2',
    name: 'Dr. Ananya Sen',
    specialty: 'GENERAL_PHYSICIAN',
    specialtyLabel: 'General Physician & Infectious Diseases',
    qualification: 'MBBS, DNB (Internal Medicine)',
    experienceYears: 10,
    opdRoom: 'Central OPD Building, Room 103',
    consultationTiming: '11:00 AM - 05:00 PM (Mon - Sat)',
    currentQueueCount: 8,
    estWaitMins: 16,
    treatingConditions: [
      'Seasonal Flu & Throat Infections',
      'Urinary Tract Infections (UTI)',
      'Thyroid Disorders (Hypo/Hyperthyroid)',
      'Joint Pain & Body Ache Workup',
      'Preventive Health Checkup Review'
    ],
    availableToday: true,
    rating: 4.8
  },

  // 5. Cardiologist
  {
    id: 'doc-cardio-1',
    name: 'Dr. Vikram Deshmukh',
    specialty: 'CARDIOLOGIST',
    specialtyLabel: 'Chief Interventional Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology), FACC',
    experienceYears: 19,
    opdRoom: 'Cardiac Care Block, Room 401',
    consultationTiming: '09:30 AM - 02:00 PM (Mon - Fri)',
    currentQueueCount: 6,
    estWaitMins: 18,
    treatingConditions: [
      'Angina & Chest Heaviness',
      'Heart Attack Post-Care & Angioplasty',
      'Heart Failure & Breathlessness',
      'Arrhythmia & Palpitations',
      'High Cholesterol & Atherosclerosis'
    ],
    availableToday: true,
    rating: 4.9
  },

  // 6. Orthopedic Surgeon
  {
    id: 'doc-ortho-1',
    name: 'Dr. Neeraj Chopra',
    specialty: 'ORTHOPEDIC',
    specialtyLabel: 'Orthopedic & Trauma Surgeon',
    qualification: 'MBBS, MS (Orthopedics), MCh Ortho',
    experienceYears: 15,
    opdRoom: 'Trauma & Bone Clinic, Room 210',
    consultationTiming: '09:00 AM - 03:00 PM (Mon - Sat)',
    currentQueueCount: 11,
    estWaitMins: 20,
    treatingConditions: [
      'Bone Fractures & Accident Trauma',
      'Knee & Hip Osteoarthritis',
      'Spine Pain, Sciatica & Slip Disc',
      'Sports Ligament Tears (ACL/MCL)',
      'Joint Replacement Consultation'
    ],
    availableToday: true,
    rating: 4.8
  }
];

export const INITIAL_BILLINGS: PatientBillingRecord[] = [
  {
    invoiceId: 'INV-AROGYA-2026-8041',
    patientId: 'pt-101',
    patientName: 'Kavita Joshi',
    tokenNumber: 'A034 / BP-101',
    age: 58,
    gender: 'Female',
    mobile: '+91 98451 22910',
    admittedWard: 'Cardiac Care Unit (CCU) / ICU',
    bedNumber: 'CCU-04',
    attendingDoctor: 'Dr. Vikram Deshmukh',
    specialty: 'Cardiology & Critical Care',
    admissionDate: '28 Sep 2026, 11:30 AM',
    dischargeDate: '02 Oct 2026, 04:00 PM',
    stayDays: 4,
    items: [
      { id: 'b-1', description: 'CCU / ICU Bed & Multipara Monitoring Tariff (4 Days)', category: 'BED', quantity: 4, ratePerUnit: 7200, total: 28800 },
      { id: 'b-2', description: 'Emergency Interventional Cardiology Consultation & Rounds', category: 'CONSULTATION', quantity: 4, ratePerUnit: 1500, total: 6000 },
      { id: 'b-3', description: '12-Lead ECG, 2D Echocardiography & Cardiac Biomarkers (Troponin-I)', category: 'LAB', quantity: 1, ratePerUnit: 4800, total: 4800 },
      { id: 'b-4', description: 'Thrombolytic Therapy, IV Heparin Infusion & Cardiac Pharmacy', category: 'PHARMACY', quantity: 1, ratePerUnit: 8200, total: 8200 },
      { id: 'b-5', description: '24x7 Critical Care Specialized ICU Nursing Care (4 Days)', category: 'NURSING', quantity: 4, ratePerUnit: 1200, total: 4800 }
    ],
    subtotal: 52600,
    govSchemeName: 'Ayushman Bharat (PM-JAY)',
    govCardNumber: 'AB-PMJAY-9042-8821',
    concessionDiscountPct: 100,
    discountAmount: 52600,
    totalPayable: 0,
    paymentStatus: 'PAID_CASHLESS',
    authCode: 'AUTH-PMJAY-DEL-404981'
  },
  {
    invoiceId: 'INV-AROGYA-2026-8042',
    patientId: 'pt-102',
    patientName: 'Ramesh Sundaram',
    tokenNumber: 'A035 / BP-102',
    age: 44,
    gender: 'Male',
    mobile: '+91 94432 11094',
    admittedWard: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-08',
    attendingDoctor: 'Dr. Rajesh K. Sharma',
    specialty: 'Pulmonary & Internal Medicine',
    admissionDate: '29 Sep 2026, 08:15 AM',
    dischargeDate: '02 Oct 2026, 02:00 PM',
    stayDays: 3,
    items: [
      { id: 'b-6', description: 'ICU Ventilator & High-Flow Oxygen Support Bed (3 Days)', category: 'BED', quantity: 3, ratePerUnit: 8500, total: 25500 },
      { id: 'b-7', description: 'Intensivist Daily Critical Rounds & ABG Assessment', category: 'CONSULTATION', quantity: 3, ratePerUnit: 1200, total: 3600 },
      { id: 'b-8', description: 'High-Resolution Chest CT Scan, Sputum Culture & ABG Panels', category: 'LAB', quantity: 1, ratePerUnit: 5200, total: 5200 },
      { id: 'b-9', description: 'IV Antibiotics (Meropenem), Bronchodilators & Nebulization', category: 'PHARMACY', quantity: 1, ratePerUnit: 6400, total: 6400 },
      { id: 'b-10', description: 'Respiratory Therapy & Critical Care Nursing Service', category: 'NURSING', quantity: 3, ratePerUnit: 1000, total: 3000 }
    ],
    subtotal: 43700,
    govSchemeName: 'ABHA Digital Health Card',
    govCardNumber: '91-4421-8930-1092',
    concessionDiscountPct: 75,
    discountAmount: 32775,
    totalPayable: 10925,
    paymentStatus: 'PARTIALLY_SUBSIDIZED',
    authCode: 'AUTH-ABHA-MAH-901142'
  },
  {
    invoiceId: 'INV-AROGYA-2026-8043',
    patientId: 'pt-103',
    patientName: 'Ananya Deshmukh',
    tokenNumber: 'A036 / BP-103',
    age: 8,
    gender: 'Female',
    mobile: '+91 97654 33219',
    admittedWard: 'Pediatric Care Unit',
    bedNumber: 'PED-14',
    attendingDoctor: 'Dr. Priya Iyer',
    specialty: 'Pediatrics',
    admissionDate: '30 Sep 2026, 02:00 PM',
    dischargeDate: '02 Oct 2026, 11:30 AM',
    stayDays: 2,
    items: [
      { id: 'b-11', description: 'Pediatric Inpatient Bed Tariff (2 Days)', category: 'BED', quantity: 2, ratePerUnit: 2000, total: 4000 },
      { id: 'b-12', description: 'Consultant Pediatrician Daily Rounds & Clinical Review', category: 'CONSULTATION', quantity: 2, ratePerUnit: 800, total: 1600 },
      { id: 'b-13', description: 'Complete Blood Count (CBC), Dengue NS1 & Serum Electrolytes', category: 'LAB', quantity: 1, ratePerUnit: 1800, total: 1800 },
      { id: 'b-14', description: 'Pediatric IV Fluids (Isolyte P), Antipyretics & Antibiotics', category: 'PHARMACY', quantity: 1, ratePerUnit: 2200, total: 2200 },
      { id: 'b-15', description: 'Pediatric Day & Night Dedicated Nursing Care', category: 'NURSING', quantity: 2, ratePerUnit: 600, total: 1200 }
    ],
    subtotal: 10800,
    govSchemeName: 'State BPL / Antyodaya Health Card',
    govCardNumber: 'BPL-MAH-8829-4110',
    concessionDiscountPct: 100,
    discountAmount: 10800,
    totalPayable: 0,
    paymentStatus: 'PAID_CASHLESS',
    authCode: 'AUTH-BPL-MAH-441029'
  },
  {
    invoiceId: 'INV-AROGYA-2026-8044',
    patientId: 'pt-104',
    patientName: 'Sunil Rao',
    tokenNumber: 'A037 / BP-104',
    age: 62,
    gender: 'Male',
    mobile: '+91 91234 55670',
    admittedWard: 'General Medical-Surgical',
    bedNumber: 'GEN-MED-45',
    attendingDoctor: 'Dr. Neeraj Chopra',
    specialty: 'General & Orthopedic Surgery',
    admissionDate: '27 Sep 2026, 09:00 AM',
    dischargeDate: '02 Oct 2026, 12:00 PM',
    stayDays: 5,
    items: [
      { id: 'b-16', description: 'General Ward Surgical Inpatient Bed Tariff (5 Days)', category: 'BED', quantity: 5, ratePerUnit: 1800, total: 9000 },
      { id: 'b-17', description: 'Senior Surgeon & Anesthetist Consultation & Pre-op Workup', category: 'CONSULTATION', quantity: 1, ratePerUnit: 3500, total: 3500 },
      { id: 'b-18', description: 'OT Charges, Surgical Theater & Post-op Recovery Room', category: 'EQUIPMENT', quantity: 1, ratePerUnit: 12000, total: 12000 },
      { id: 'b-19', description: 'Abdominal Ultrasound, Pathology Biopsy & Blood Grouping', category: 'LAB', quantity: 1, ratePerUnit: 3400, total: 3400 },
      { id: 'b-20', description: 'Post-operative Medications, Surgical Dressings & IV Lines', category: 'PHARMACY', quantity: 1, ratePerUnit: 4800, total: 4800 },
      { id: 'b-21', description: 'Inpatient Surgical Nursing & Wound Care (5 Days)', category: 'NURSING', quantity: 5, ratePerUnit: 500, total: 2500 }
    ],
    subtotal: 35200,
    govSchemeName: 'Central Govt Health Scheme (CGHS)',
    govCardNumber: 'CGHS-DEL-2024-5519',
    concessionDiscountPct: 90,
    discountAmount: 31680,
    totalPayable: 3520,
    paymentStatus: 'SETTLED',
    authCode: 'AUTH-CGHS-DEL-88412'
  }
];

// Helper to trigger browser download of official hospital billing receipt
export function downloadBillingReceipt(record: PatientBillingRecord) {
  const fileContent = `================================================================================
METROPOLIS GOVERNMENT MEDICAL COLLEGE & LEVEL-1 TRAUMA HOSPITAL
Affiliated with Ministry of Health & Family Welfare (MoHFW) | Govt. of India
NABH Accredited & PM-JAY Ayushman Bharat Certified Hospital
Arogya AI Smart Bed & Billing System · Developed by Error 404
================================================================================
OFFICIAL INPATIENT BILLING STATEMENT & CONCESSION CERTIFICATE
================================================================================
Invoice No      : ${record.invoiceId}
Authorization   : ${record.authCode}
Date of Issue   : ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString()}
Token / Bed     : ${record.tokenNumber} | Bed: ${record.bedNumber}
Admitted Ward   : ${record.admittedWard}
Attending Doctor: ${record.attendingDoctor} (${record.specialty})

PATIENT DETAILS:
--------------------------------------------------------------------------------
Patient Name    : ${record.patientName}
Age / Gender    : ${record.age} Years / ${record.gender}
Mobile No       : ${record.mobile}
Admission Date  : ${record.admissionDate}
Discharge Date  : ${record.dischargeDate} (Stay Duration: ${record.stayDays} Days)

ITEMIZED CHARGES BREAKDOWN:
--------------------------------------------------------------------------------
${record.items.map((item, i) => `${i + 1}. [${item.category}] ${item.description}\n   Qty: ${item.quantity} x Rs. ${item.ratePerUnit.toLocaleString()} = Rs. ${item.total.toLocaleString()}`).join('\n\n')}

--------------------------------------------------------------------------------
GROSS TOTAL CHARGES    : Rs. ${record.subtotal.toLocaleString()}
Government Health Scheme: ${record.govSchemeName || 'General / Non-insured'}
Beneficiary Card No    : ${record.govCardNumber || 'N/A'}
Subsidy / Concession Rate: ${record.concessionDiscountPct}%
CONCESSION DEDUCTION   : - Rs. ${record.discountAmount.toLocaleString()}
================================================================================
NET PAYABLE BY PATIENT : Rs. ${record.totalPayable.toLocaleString()} ${record.totalPayable === 0 ? '(100% CASHLESS BENEFIT UNDER GOVT SCHEME)' : ''}
PAYMENT STATUS         : ${record.paymentStatus.replace('_', ' ')}
================================================================================
This is a computer-generated tax & concession invoice authenticated by Arogya AI.
No physical signature required. Verified under NHA & Ayushman Bharat Gateway.
Emergency Helpline: 108 | Hospital Helpdesk: Ext 9911
================================================================================`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ArogyaAI_Invoice_${record.invoiceId}_${record.patientName.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
