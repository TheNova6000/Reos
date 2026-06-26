"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, IndianRupee } from "lucide-react";
import {
  formatCurrency,
  STAMP_DUTY_RATES,
  REGISTRATION_FEE_RATES,
} from "@/lib/constants";
import { useDemoStore } from "@/lib/demo-store";

interface RegistrationCalculatorDialogProps {
  propertyValue?: number;
  state?: string;
}

export function RegistrationCalculatorDialog({
  propertyValue,
  state,
}: RegistrationCalculatorDialogProps) {
  const store = useDemoStore();
  const [value, setValue] = useState(propertyValue?.toString() || "");
  const [selectedState, setSelectedState] = useState(state || "Telangana");
  const [includeGst, setIncludeGst] = useState(false);

  const amount = parseFloat(value) || 0;
  const stampDutyRate = STAMP_DUTY_RATES[selectedState] ?? 6;
  const registrationRate = REGISTRATION_FEE_RATES[selectedState] ?? 1;
  const stampDuty = Math.round(amount * stampDutyRate / 100);
  const registrationFee = Math.round(amount * registrationRate / 100);
  const gst = includeGst ? Math.round(amount * 5 / 100) : 0;
  const tdsRate = store.settings.tds_percentage;
  const tds = amount >= 5000000 ? Math.round(amount * tdsRate / 100) : 0;
  const totalCharges = stampDuty + registrationFee + gst;
  const grandTotal = amount + totalCharges;

  const states = Object.keys(STAMP_DUTY_RATES).sort();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
        <Calculator className="w-4 h-4 mr-1" />
        Registration Calculator
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Registration Charges Calculator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calc-value">Property Value (₹)</Label>
              <Input
                id="calc-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., 3500000"
              />
            </div>
            <div className="space-y-2">
              <Label id="calc-state-label">State</Label>
              <Select value={selectedState} onValueChange={(v) => v && setSelectedState(v)}>
                <SelectTrigger aria-labelledby="calc-state-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeGst}
              onChange={(e) => setIncludeGst(e.target.checked)}
              className="rounded border-muted-foreground"
            />
            Include GST (5% for under-construction)
          </label>

          {amount > 0 && (
            <div className="rounded-lg border divide-y">
              <div className="flex justify-between p-3 text-sm">
                <span className="text-muted-foreground">Property Value</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between p-3 text-sm">
                <span className="text-muted-foreground">
                  Stamp Duty ({stampDutyRate}%)
                </span>
                <span className="font-medium">{formatCurrency(stampDuty)}</span>
              </div>
              <div className="flex justify-between p-3 text-sm">
                <span className="text-muted-foreground">
                  Registration Fee ({registrationRate}%)
                </span>
                <span className="font-medium">{formatCurrency(registrationFee)}</span>
              </div>
              {includeGst && (
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span className="font-medium">{formatCurrency(gst)}</span>
                </div>
              )}
              <div className="flex justify-between p-3 text-sm bg-muted/30">
                <span className="font-semibold">Total Charges</span>
                <span className="font-bold text-primary">{formatCurrency(totalCharges)}</span>
              </div>
              <div className="flex justify-between p-3 text-sm bg-muted/30">
                <span className="font-semibold">Grand Total</span>
                <span className="font-bold">{formatCurrency(grandTotal)}</span>
              </div>
              {tds > 0 && (
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-muted-foreground">
                    TDS Deduction ({tdsRate}% — Section 194-IA)
                  </span>
                  <span className="font-medium text-amber-600">{formatCurrency(tds)}</span>
                </div>
              )}
            </div>
          )}

          {amount > 0 && (
            <p className="text-[11px] text-muted-foreground">
              Rates are approximate and vary by municipality. Consult your lawyer for exact charges. TDS applies for amounts ≥ ₹50 lakhs.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
