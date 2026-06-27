import { STAMP_DUTY_RATES, REGISTRATION_FEE_RATES } from "@/lib/constants";

export const TDS_THRESHOLD = 5_000_000; // ₹50 lakhs — Section 194-IA

export function calculateTds(amount: number, tdsRatePercent: number): number {
  if (amount < TDS_THRESHOLD) return 0;
  return Math.round(amount * tdsRatePercent / 100);
}

export function getStampDutyRate(state: string): number {
  return STAMP_DUTY_RATES[state] ?? 6;
}

export function getRegistrationFeeRate(state: string): number {
  return REGISTRATION_FEE_RATES[state] ?? 1;
}

export function calculateStampDuty(propertyValue: number, state: string): number {
  return Math.round(propertyValue * getStampDutyRate(state) / 100);
}

export function calculateRegistrationFee(propertyValue: number, state: string): number {
  return Math.round(propertyValue * getRegistrationFeeRate(state) / 100);
}

export interface RegistrationCharges {
  stampDutyRate: number;
  registrationRate: number;
  stampDuty: number;
  registrationFee: number;
  gst: number;
  tds: number;
  totalCharges: number;
  grandTotal: number;
}

export function calculateRegistrationCharges(
  propertyValue: number,
  state: string,
  options: { includeGst?: boolean; tdsRatePercent?: number } = {}
): RegistrationCharges {
  const { includeGst = false, tdsRatePercent = 1 } = options;
  const stampDutyRate = getStampDutyRate(state);
  const registrationRate = getRegistrationFeeRate(state);
  const stampDuty = Math.round(propertyValue * stampDutyRate / 100);
  const registrationFee = Math.round(propertyValue * registrationRate / 100);
  const gst = includeGst ? Math.round(propertyValue * 5 / 100) : 0;
  const tds = calculateTds(propertyValue, tdsRatePercent);
  const totalCharges = stampDuty + registrationFee + gst;
  const grandTotal = propertyValue + totalCharges;
  return { stampDutyRate, registrationRate, stampDuty, registrationFee, gst, tds, totalCharges, grandTotal };
}
