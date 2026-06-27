import { describe, it, expect } from "vitest";
import {
  TDS_THRESHOLD,
  calculateTds,
  calculateStampDuty,
  calculateRegistrationFee,
  getStampDutyRate,
  getRegistrationFeeRate,
  calculateRegistrationCharges,
} from "./calculations";

describe("TDS — Section 194-IA", () => {
  it("threshold is exactly ₹50 lakhs", () => {
    expect(TDS_THRESHOLD).toBe(5_000_000);
  });

  it("zero TDS for amount just below threshold (₹49,99,999)", () => {
    expect(calculateTds(4_999_999, 1)).toBe(0);
  });

  it("TDS applies at exactly ₹50 lakhs", () => {
    // ₹50,00,000 × 1% = ₹50,000
    expect(calculateTds(5_000_000, 1)).toBe(50_000);
  });

  it("TDS applies above threshold — ₹55L at 1%", () => {
    // ₹55,00,000 × 1% = ₹55,000
    expect(calculateTds(5_500_000, 1)).toBe(55_000);
  });

  it("TDS at 2% rate for ₹1 crore", () => {
    // ₹1,00,00,000 × 2% = ₹2,00,000
    expect(calculateTds(10_000_000, 2)).toBe(200_000);
  });

  it("zero amount returns zero TDS", () => {
    expect(calculateTds(0, 1)).toBe(0);
  });

  it("rounds to nearest rupee", () => {
    // ₹50,00,001 × 1% = 50000.01 → rounds to 50000
    expect(calculateTds(5_000_001, 1)).toBe(50_000);
    // ₹50,00,050 × 1% = 50000.5 → rounds to 50001
    expect(calculateTds(5_000_050, 1)).toBe(50_001);
  });
});

describe("Stamp duty rates", () => {
  it("Telangana is 6%", () => {
    expect(getStampDutyRate("Telangana")).toBe(6);
  });

  it("Maharashtra is 5%", () => {
    expect(getStampDutyRate("Maharashtra")).toBe(5);
  });

  it("Goa is 3.5% (lowest in table)", () => {
    expect(getStampDutyRate("Goa")).toBe(3.5);
  });

  it("Assam is 8.25% (highest in table)", () => {
    expect(getStampDutyRate("Assam")).toBe(8.25);
  });

  it("unknown state falls back to 6%", () => {
    expect(getStampDutyRate("UnknownState")).toBe(6);
    expect(getStampDutyRate("")).toBe(6);
  });

  it("calculateStampDuty — ₹35L in Telangana (6%) = ₹2,10,000", () => {
    expect(calculateStampDuty(3_500_000, "Telangana")).toBe(210_000);
  });

  it("calculateStampDuty — ₹50L in Goa (3.5%) = ₹1,75,000", () => {
    expect(calculateStampDuty(5_000_000, "Goa")).toBe(175_000);
  });
});

describe("Registration fee rates", () => {
  it("Telangana is 0.5%", () => {
    expect(getRegistrationFeeRate("Telangana")).toBe(0.5);
  });

  it("Karnataka is 1%", () => {
    expect(getRegistrationFeeRate("Karnataka")).toBe(1);
  });

  it("Kerala is 2% (highest)", () => {
    expect(getRegistrationFeeRate("Kerala")).toBe(2);
  });

  it("unknown state falls back to 1%", () => {
    expect(getRegistrationFeeRate("UnknownState")).toBe(1);
  });

  it("calculateRegistrationFee — ₹35L in Telangana (0.5%) = ₹17,500", () => {
    expect(calculateRegistrationFee(3_500_000, "Telangana")).toBe(17_500);
  });
});

describe("calculateRegistrationCharges — combined output", () => {
  it("Telangana ₹35L without GST", () => {
    const result = calculateRegistrationCharges(3_500_000, "Telangana");
    expect(result.stampDutyRate).toBe(6);
    expect(result.registrationRate).toBe(0.5);
    expect(result.stampDuty).toBe(210_000);
    expect(result.registrationFee).toBe(17_500);
    expect(result.gst).toBe(0);
    expect(result.tds).toBe(0); // below ₹50L threshold
    expect(result.totalCharges).toBe(227_500);
    expect(result.grandTotal).toBe(3_727_500);
  });

  it("Telangana ₹35L with GST (5%)", () => {
    const result = calculateRegistrationCharges(3_500_000, "Telangana", { includeGst: true });
    expect(result.gst).toBe(175_000); // 5% of ₹35L
    expect(result.totalCharges).toBe(402_500); // 210000 + 17500 + 175000
    expect(result.grandTotal).toBe(3_902_500);
  });

  it("TDS applies when property value ≥ ₹50L", () => {
    const result = calculateRegistrationCharges(6_000_000, "Telangana", { tdsRatePercent: 1 });
    expect(result.tds).toBe(60_000); // 1% of ₹60L
  });

  it("TDS does not appear in totalCharges or grandTotal", () => {
    // TDS is deducted by buyer — it's informational, not added to the price
    const result = calculateRegistrationCharges(6_000_000, "Telangana", { tdsRatePercent: 1 });
    expect(result.totalCharges).toBe(result.stampDuty + result.registrationFee + result.gst);
    expect(result.grandTotal).toBe(6_000_000 + result.totalCharges);
  });

  it("unknown state uses fallback rates", () => {
    const result = calculateRegistrationCharges(1_000_000, "Nagaland");
    expect(result.stampDutyRate).toBe(6);
    expect(result.registrationRate).toBe(1);
    expect(result.stampDuty).toBe(60_000);
    expect(result.registrationFee).toBe(10_000);
  });
});
