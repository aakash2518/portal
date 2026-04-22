import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FeeFormData {
  student_name: string;
  parent_name: string;
  program: string;
  admission_number: string;
  enrollment_number: string;
  mobile_number: string;
  month: string;
  year: string;
  fee_amount: string;
  pay_mode: string;
  bank_name: string;
  txn_number: string;
  txn_date: string;
  collected_by: string;
}

const MONTHS = [
  "1 Month",
  "3 Months",
  "Other"
];

const YEARS = [
  "2024-25",
  "2025-26",
  "2026-27",
  "2027-28",
  "2028-29",
];

const PROGRAMS = [
  "Filial Love",
  "Hacer Morning",
  "Hacer Evening",
  "Walk-in Daycare",
  "Gravida Bambino",
];

export default function FeeForm({ onSubmit, isLoading }: { onSubmit: (data: FeeFormData) => void; isLoading: boolean }) {
  const [form, setForm] = useState<FeeFormData>({
    student_name: "",
    parent_name: "",
    program: "",
    admission_number: "",
    enrollment_number: "",
    mobile_number: "",
    month: "",
    year: "2026-27",
    fee_amount: "",
    pay_mode: "Online",
    bank_name: "",
    txn_number: "",
    txn_date: "",
    collected_by: "Super Admin",
  });

  const [customMonth, setCustomMonth] = useState("");

  const handleChange = (field: keyof FeeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Reset custom month when changing month selection
    if (field === "month" && value !== "Other") {
      setCustomMonth("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If "Other" is selected, use custom month value
    const finalForm = {
      ...form,
      month: form.month === "Other" ? customMonth : form.month
    };
    onSubmit(finalForm);
  };

  const feeNum = parseFloat(form.fee_amount) || 0;
  const netAmount = Math.round(feeNum);
  const cgst = Math.round(netAmount * 0.09);
  const sgst = Math.round(netAmount * 0.09);
  const total = netAmount + cgst + sgst;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">New Fee Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Student Name *</Label>
            <Input required value={form.student_name} onChange={(e) => handleChange("student_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Parent Name *</Label>
            <Input required value={form.parent_name} onChange={(e) => handleChange("parent_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Program *</Label>
            <Select value={form.program} onValueChange={(v) => handleChange("program", v)}>
              <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Admission Number</Label>
            <Input value={form.admission_number} onChange={(e) => handleChange("admission_number", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Enrollment Number</Label>
            <Input value={form.enrollment_number} onChange={(e) => handleChange("enrollment_number", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Mobile Number *</Label>
            <Input required value={form.mobile_number} onChange={(e) => handleChange("mobile_number", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Month *</Label>
            <Select value={form.month} onValueChange={(v) => handleChange("month", v)}>
              <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {form.month === "Other" && (
            <div className="space-y-1.5">
              <Label>Custom Month *</Label>
              <Input 
                required 
                value={customMonth} 
                onChange={(e) => setCustomMonth(e.target.value)} 
                placeholder="Enter custom month"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Year *</Label>
            <Select value={form.year} onValueChange={(v) => handleChange("year", v)}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Fee Amount (Base Amount) *</Label>
            <Input required type="number" min="0" step="0.01" value={form.fee_amount} onChange={(e) => handleChange("fee_amount", e.target.value)} placeholder="Enter base amount" />
          </div>
          <div className="space-y-1.5">
            <Label>Pay Mode</Label>
            <Select value={form.pay_mode} onValueChange={(v) => handleChange("pay_mode", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Collected By</Label>
            <Input value={form.collected_by} onChange={(e) => handleChange("collected_by", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Bank Name</Label>
            <Input value={form.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Transaction Number</Label>
            <Input value={form.txn_number} onChange={(e) => handleChange("txn_number", e.target.value)} />
          </div>

          {/* GST Preview */}
          {feeNum > 0 && (
            <div className="col-span-full bg-muted rounded-lg p-3 text-sm space-y-1 animate-in fade-in">
              <p className="flex justify-between"><span>Base Amount:</span> <strong>₹{netAmount}</strong></p>
              <p className="flex justify-between"><span>CGST (9%):</span> <strong>₹{cgst}</strong></p>
              <p className="flex justify-between"><span>SGST (9%):</span> <strong>₹{sgst}</strong></p>
              <p className="flex justify-between border-t pt-1 mt-1"><span>Total Amount (with GST):</span> <strong className="text-primary text-lg">₹{total}</strong></p>
            </div>
          )}

          <div className="col-span-full">
            <Button type="submit" className="w-full transition-all hover:scale-[1.02]" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Generating Receipt...
                </span>
              ) : (
                "Generate Receipt"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
