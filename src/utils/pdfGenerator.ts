import { jsPDF } from 'jspdf';
import { Bed, PatientBillingRecord, TokenConcessionSlip, AppointmentRecord } from '../types/hospital';

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AROGYA AI · PREDICTIVE HOSPITAL OPERATIONS', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Metropolis Government Hospital & Level-1 Trauma Center · Demo Environment', 14, 18);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title, 14, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${subtitle} | Generated on: ${new Date().toLocaleString()}`, 14, 40);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 43, 196, 43);
}

function addFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 14, 196, pageHeight - 14);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Authenticated by Arogya AI BedPulse Engine · Synthetic Demo Data for Medical Demonstration Only', 14, pageHeight - 9);
  doc.text('Emergency Toll-Free: 108 | Central Ops: Ext 9911', 140, pageHeight - 9);
}

// 1. Daily Bed Occupancy Report
export function generateBedOccupancyPdf(beds: Bed[], stats: { total: number; occupied: number; available: number; cleaning: number; reserved: number; icuOccPct: number }) {
  const doc = new jsPDF();
  addHeader(doc, 'DAILY HOSPITAL BED OCCUPANCY & CAPACITY REPORT', 'Real-time Ward Census and Bed Lifecycle Breakdown');

  // Stats KPI Grid
  let y = 50;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL BEDS', 20, y + 7);
  doc.text('OCCUPIED', 55, y + 7);
  doc.text('AVAILABLE', 90, y + 7);
  doc.text('CLEANING', 125, y + 7);
  doc.text('RESERVED', 160, y + 7);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`${stats.total}`, 20, y + 17);
  doc.setTextColor(225, 29, 72); // rose
  doc.text(`${stats.occupied}`, 55, y + 17);
  doc.setTextColor(5, 150, 105); // emerald
  doc.text(`${stats.available}`, 90, y + 17);
  doc.setTextColor(217, 119, 6); // amber
  doc.text(`${stats.cleaning}`, 125, y + 17);
  doc.setTextColor(124, 58, 237); // purple
  doc.text(`${stats.reserved}`, 160, y + 17);

  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Detailed Individual Bed Unit Status (Active Sample)', 14, y);

  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Bed ID', 18, y + 5);
  doc.text('Ward / Dept', 45, y + 5);
  doc.text('Status', 85, y + 5);
  doc.text('Patient Name / UHID', 120, y + 5);
  doc.text('Acuity / Priority', 165, y + 5);

  y += 7;
  doc.setFont('helvetica', 'normal');
  const sampleBeds = beds.slice(0, 22);

  sampleBeds.forEach((b, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6.5, 'F');
    }
    doc.setTextColor(15, 23, 42);
    doc.text(b.code || b.id, 18, y + 4.5);
    doc.text(b.wardName || 'General Ward', 45, y + 4.5);
    doc.text(b.status, 85, y + 4.5);
    doc.text(b.patientName || '— Unoccupied —', 120, y + 4.5);
    doc.text(b.acuity || 'Standard', 165, y + 4.5);
    y += 6.5;
  });

  addFooter(doc);
  doc.save(`ArogyaAI_Bed_Occupancy_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// 2. Capacity Forecast & Surge Report
export function generateCapacityForecastPdf(forecastSummary: { shortageEta: string; predictedDemand: number; riskLevel: string; currentOcc: number }) {
  const doc = new jsPDF();
  addHeader(doc, 'AI CAPACITY FORECAST & SURGE EARLY WARNING REPORT', 'Predictive Ensemble Model · 24-Hour Horizon Projection');

  let y = 52;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(190, 18, 60);
  doc.text('CRITICAL SURGE EARLY WARNING SUMMARY', 20, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Estimated Shortage Lead Time: ${forecastSummary.shortageEta}`, 20, y + 16);
  doc.text(`Projected 24-Hour Demand: ${forecastSummary.predictedDemand} beds (Current load: ${forecastSummary.currentOcc}/300)`, 20, y + 21);
  doc.text(`Automated Surge Risk Level: ${forecastSummary.riskLevel} ALERT`, 20, y + 26);

  y += 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Recommended Operational Actions (Human-in-the-Loop)', 14, y);

  const actions = [
    '1. Priority Step-Down Discharges: Fast-track 12 general ward patients to clear step-down buffer.',
    '2. Environmental Services: Mobilize 15-minute rapid housekeeping protocol for Ward B and ICU.',
    '3. Elective Surgery Deferral: Pause non-urgent elective admissions for next 24-hour cycle.',
    '4. Float Pool Nursing: Alert on-call nursing teams for high-dependency unit staffing.'
  ];

  y += 5;
  actions.forEach((act) => {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(act, 16, y);
  });

  addFooter(doc);
  doc.save(`ArogyaAI_Capacity_Forecast_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// 3. Patient Invoice & Concession Bill
export function generatePatientInvoicePdf(record: PatientBillingRecord) {
  const doc = new jsPDF();
  addHeader(doc, 'OFFICIAL INPATIENT BILLING & CONCESSION INVOICE', `Invoice #${record.invoiceId} · Auth: ${record.authCode}`);

  let y = 50;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 26, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Patient: ${record.patientName} (${record.age}y / ${record.gender})`, 20, y + 7);
  doc.text(`Token / Bed: ${record.tokenNumber} | Bed: ${record.bedNumber}`, 110, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Ward: ${record.admittedWard}`, 20, y + 14);
  doc.text(`Doctor: ${record.attendingDoctor}`, 110, y + 14);
  doc.text(`Stay Duration: ${record.admissionDate} to ${record.dischargeDate} (${record.stayDays} Days)`, 20, y + 21);
  doc.text(`Scheme: ${record.govSchemeName || 'General / None'}`, 110, y + 21);

  y += 34;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Itemized Charges Breakdown', 14, y);

  y += 5;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 6, 'F');
  doc.setFontSize(7.5);
  doc.text('Item Description', 18, y + 4);
  doc.text('Category', 90, y + 4);
  doc.text('Qty', 130, y + 4);
  doc.text('Rate (INR)', 150, y + 4);
  doc.text('Total (INR)', 175, y + 4);

  y += 6;
  doc.setFont('helvetica', 'normal');
  record.items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 5.5, 'F');
    }
    doc.text(item.description, 18, y + 4);
    doc.text(item.category, 90, y + 4);
    doc.text(`${item.quantity}`, 130, y + 4);
    doc.text(`₹${item.ratePerUnit.toLocaleString()}`, 150, y + 4);
    doc.text(`₹${item.total.toLocaleString()}`, 175, y + 4);
    y += 5.5;
  });

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Gross Total Charges:', 120, y);
  doc.text(`₹${record.subtotal.toLocaleString()}`, 175, y);

  y += 6;
  doc.setTextColor(5, 150, 105);
  doc.text(`Govt Subsidy (${record.concessionDiscountPct}% Concession):`, 120, y);
  doc.text(`- ₹${record.discountAmount.toLocaleString()}`, 175, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Net Payable by Patient:', 120, y);
  doc.text(record.totalPayable === 0 ? '₹0 (100% Cashless)' : `₹${record.totalPayable.toLocaleString()}`, 175, y);

  addFooter(doc);
  doc.save(`ArogyaAI_Invoice_${record.invoiceId}_${record.patientName.replace(/\s+/g, '_')}.pdf`);
}

// 4. Appointment Slip
export function generateAppointmentSlipPdf(appointment: AppointmentRecord) {
  const doc = new jsPDF();
  addHeader(doc, 'OPD CONSULTATION & APPOINTMENT TOKEN SLIP', `Token No: ${appointment.tokenNumber} · Status: ${appointment.status}`);

  let y = 55;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, y, 182, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(4, 120, 87);
  doc.text(`TOKEN: ${appointment.tokenNumber}`, 20, y + 14);

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Patient: ${appointment.patientName}`, 20, y + 24);
  doc.text(`Doctor: ${appointment.doctorName}`, 20, y + 31);
  doc.text(`Department: ${appointment.department}`, 20, y + 38);
  doc.text(`Scheduled: ${appointment.date} at ${appointment.time}`, 20, y + 45);

  y += 60;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Patient Instructions:', 14, y);
  doc.text('• Please arrive at the OPD waiting lounge 15 minutes before your scheduled appointment.', 14, y + 6);
  doc.text('• Display this token number at the nursing desk or on the queue display screen.', 14, y + 12);
  doc.text('• Carry previous prescriptions, diagnostic lab reports, and government health card if applicable.', 14, y + 18);

  addFooter(doc);
  doc.save(`ArogyaAI_Token_${appointment.tokenNumber}_${appointment.patientName.replace(/\s+/g, '_')}.pdf`);
}

// 5. Government Concession Certificate
export function generateConcessionCertificatePdf(slip: TokenConcessionSlip) {
  const doc = new jsPDF();
  addHeader(doc, 'GOVERNMENT CONCESSION CERTIFICATE & BED SUBSIDY CLEARANCE', `Token: ${slip.tokenNumber} · Auth Code: ${slip.authCode}`);

  let y = 52;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 60, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(22, 101, 52);
  doc.text('100% CASHLESS BENEFIT / SUBSIDY VERIFIED', 20, y + 11);

  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Beneficiary Name: ${slip.patientName} (${slip.age}y)`, 20, y + 21);
  doc.text(`Entitled Scheme: ${slip.schemeName}`, 20, y + 28);
  doc.text(`Card / ABHA ID: ${slip.cardNumber}`, 20, y + 35);
  doc.text(`Assigned Bed Unit: ${slip.assignedBed} (${slip.targetWard})`, 20, y + 42);
  doc.text(`Valid Until: ${slip.validUntil}`, 20, y + 49);
  doc.text(`Authorization Key: ${slip.authCode}`, 20, y + 56);

  addFooter(doc);
  doc.save(`ArogyaAI_Concession_${slip.tokenNumber}_${slip.patientName.replace(/\s+/g, '_')}.pdf`);
}
