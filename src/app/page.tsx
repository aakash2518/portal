"use client";

import { useState } from "react";
import FeeForm, { type FeeFormData } from "@/components/FeeForm";
import ReceiptView, { type ReceiptData } from "@/components/ReceiptView";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { Download, Plus } from "lucide-react";

export default function Home() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleSubmit = async (formData: FeeFormData) => {
    setIsLoading(true);
    try {
      const feeAmount = parseFloat(formData.fee_amount) || 0;
      const netAmount = Math.round(feeAmount);
      const cgst = Math.round(netAmount * 0.09);
      const sgst = Math.round(netAmount * 0.09);
      const totalAmount = netAmount + cgst + sgst;

      const { data, error } = await supabase.from("receipts").insert({
        student_name: formData.student_name,
        parent_name: formData.parent_name,
        program: formData.program,
        admission_number: formData.admission_number || null,
        enrollment_number: formData.enrollment_number || null,
        mobile_number: formData.mobile_number,
        month: formData.month,
        year: formData.year,
        fee_amount: feeAmount,
        net_amount: netAmount,
        cgst_amount: cgst,
        sgst_amount: sgst,
        total_amount: totalAmount,
        paid_amount: totalAmount,
        balance_due: 0,
        pay_mode: formData.pay_mode,
        bank_name: formData.bank_name || null,
        txn_number: formData.txn_number || null,
        txn_date: formData.txn_date || null,
        collected_by: formData.collected_by || "Super Admin",
      }).select().single();

      if (error) throw error;

      setReceipt({
        receipt_number: data.receipt_number,
        receipt_date: new Date(data.receipt_date).toLocaleDateString("en-IN"),
        student_name: data.student_name,
        parent_name: data.parent_name,
        program: data.program,
        admission_number: data.admission_number || "",
        enrollment_number: data.enrollment_number || "",
        mobile_number: data.mobile_number,
        month: data.month,
        year: data.year || "2026-27",
        fee_amount: data.fee_amount,
        net_amount: data.net_amount,
        cgst_amount: data.cgst_amount,
        sgst_amount: data.sgst_amount,
        total_amount: data.total_amount,
        paid_amount: data.paid_amount,
        balance_due: data.balance_due,
        pay_mode: data.pay_mode,
        bank_name: data.bank_name || "",
        txn_number: data.txn_number || "",
        txn_date: data.txn_date || "",
        collected_by: data.collected_by,
      });
    } catch (err) {
      console.error("Error creating receipt:", err);
      alert("Failed to create receipt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);
    try {
      const element = document.getElementById("receipt-print");
      if (!element) return;
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${receipt?.receipt_number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!receipt ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Create New Receipt</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details below to generate a fee receipt
              </p>
            </div>
            <FeeForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-foreground">Receipt Generated Successfully</h2>
                <p className="text-sm text-muted-foreground">Receipt #{receipt.receipt_number}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleDownloadPDF} 
                  disabled={isPdfGenerating}
                  className="transition-all hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isPdfGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Generating...
                    </span>
                  ) : (
                    "Download PDF"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setReceipt(null)}
                  className="transition-all hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Receipt
                </Button>
              </div>
            </div>
            <ReceiptView data={receipt} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
