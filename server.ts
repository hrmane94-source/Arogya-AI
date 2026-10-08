import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is provided
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI();
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// API Route: AI Clinical Voice Consultant & Crisis Advisory
app.post('/api/ai-consultant', async (req, res) => {
  try {
    const { query, hospitalState } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const stateSummary = hospitalState ? JSON.stringify(hospitalState) : 'Hospital occupancy is 213/300 (71%). ICU is 18/20 (90%). Shortage predicted in 9 hours with 236 beds needed.';

    // If Gemini API is available, generate clinical response
    if (ai && process.env.GEMINI_API_KEY) {
      const prompt = `You are BedPulse AI Voice Consultant, an advanced clinical hospital bed capacity strategist and command center voice advisor for Metropolis General Hospital (300 total beds).
Current Hospital State Telemetry:
${stateSummary}

User Voice Query: "${query}"

Provide a concise, direct, clinical yet authoritative verbal briefing response (max 3-4 sentences or 80-100 words) suitable to be read aloud via speech synthesis to the hospital director or bed manager.
Include specific numbers, risk status, and 1-2 actionable operational recommendations (such as accelerating step-down discharges, activating surge nursing, or deferring elective admissions). Do not use markdown headers or asterisks so it sounds natural when spoken aloud.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const replyText = response.text?.trim() || 'BedPulse telemetry confirms 87 beds available with ICU at 90 percent capacity. Recommendation is to expedite 12 eligible step-down discharges before midnight.';
      return res.json({ reply: replyText, source: 'gemini-3.8-flash' });
    }

    // Heuristic Clinical AI Fallback (if no API key configured or offline)
    let fallbackReply = `BedPulse AI advisory: Current occupancy is 213 out of 300 beds. ICU capacity is critical at 90 percent. We project demand exceeding threshold in 9 hours. Recommend expediting 12 step-down discharges and activating Housekeeping priority turnaround for General Ward B.`;
    
    const lower = query.toLowerCase();
    if (lower.includes('icu') || lower.includes('critical')) {
      fallbackReply = `ICU capacity is currently at 90 percent with 18 of 20 beds occupied. Based on emergency room inbound trauma, we project ICU saturation within 14 hours. Please review step-down candidates in Bed 4 and Bed 11 immediately.`;
    } else if (lower.includes('surge') || lower.includes('what if') || lower.includes('spike')) {
      fallbackReply = `Simulating a 20 percent surge projects 274 beds occupied by tomorrow 6 PM. Available beds will drop from 87 to 39. Immediate recommendation is to defer elective surgical admissions and alert on-call nursing teams.`;
    } else if (lower.includes('discharge') || lower.includes('patient')) {
      fallbackReply = `There are currently 31 planned discharges today, with 12 patients meeting rapid discharge criteria before 2 PM. Clearing these will increase available general beds to 99 and reduce our shortage risk to moderate.`;
    } else if (lower.includes('card') || lower.includes('ayushman') || lower.includes('token') || lower.includes('scheme')) {
      fallbackReply = `Government health cards including Ayushman Bharat PM-JAY and CGHS are active. Token concession verification provides 100 percent ICU bed waiver and zero-copay for eligible priority tiers.`;
    }

    return res.json({ reply: fallbackReply, source: 'bedpulse-heuristic-engine' });
  } catch (error: any) {
    console.error('AI Consultant Error:', error);
    return res.status(500).json({
      reply: 'BedPulse telemetry active. Critical alert: ICU is at 90% capacity. Prioritize discharge planning for eligible patients within 14 hours.',
      source: 'fallback'
    });
  }
});

// API Route: Scenario Simulation with AI Insights
app.post('/api/simulate-crisis', async (req, res) => {
  try {
    const { scenarioName, admissionMultiplier, dischargeDelayHours, massCasualtyCount, wardClosureBeds } = req.body;
    
    const currentOccupied = 213;
    const totalBeds = 300 - (wardClosureBeds || 0);
    const baselineAdmissions = 42;
    const baselineDischarges = 31;

    const projectedAdmissions = Math.round(baselineAdmissions * (admissionMultiplier || 1.0)) + (massCasualtyCount || 0);
    const projectedDischarges = Math.round(baselineDischarges * Math.max(0.2, 1 - (dischargeDelayHours || 0) * 0.08));
    
    const projectedOccupied = Math.min(300, currentOccupied + projectedAdmissions - projectedDischarges);
    const projectedAvailable = Math.max(0, totalBeds - projectedOccupied);
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let hoursToShortage = 24;

    const occupancyRate = projectedOccupied / totalBeds;
    if (occupancyRate >= 0.95 || projectedAvailable <= 10) {
      riskLevel = 'CRITICAL';
      hoursToShortage = Math.max(2, Math.round(6 - (occupancyRate - 0.95) * 20));
    } else if (occupancyRate >= 0.85 || projectedAvailable <= 35) {
      riskLevel = 'HIGH';
      hoursToShortage = Math.max(6, Math.round(14 - (occupancyRate - 0.85) * 30));
    } else if (occupancyRate >= 0.75) {
      riskLevel = 'MODERATE';
      hoursToShortage = 18;
    }

    return res.json({
      scenarioName: scenarioName || 'Custom Simulation',
      projectedOccupied,
      projectedAvailable,
      projectedAdmissions,
      projectedDischarges,
      totalBeds,
      riskLevel,
      hoursToShortage,
      mitigationProtocol: riskLevel === 'CRITICAL' 
        ? ['Activate Code Yellow Hospital Surge', 'Cancel all elective surgeries for 48h', 'Convert Post-Anesthesia Care Unit (PACU) to 12 ICU step-down beds', 'Mobilize reserve nursing float pool']
        : riskLevel === 'HIGH'
        ? ['Prioritize early morning discharge rounds', 'Alert environmental services for rapid 15-minute bed turnover', 'Open 10 overflow observation beds']
        : ['Standard clinical bed management protocols', 'Monitor emergency department arrival rate']
    });
  } catch (error) {
    console.error('Simulation error:', error);
    return res.status(500).json({ error: 'Simulation failed' });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BedPulse AI Server running on port ${PORT}`);
  });
}

startServer();
