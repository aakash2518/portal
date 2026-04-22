import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IndianRupee, Receipt, TrendingUp, FileText, Trash2, RotateCcw, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Receipt {
  id: string;
  receipt_number: number;
  student_name: string;
  parent_name: string;
  month: string;
  year: string;
  total_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  paid_amount: number;
  receipt_date: string;
  program: string;
  deleted_at: string | null;
}

const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
  "1 Month", "3 Months", "Other"
];

const YEARS = ["All", "2024-25", "2025-26", "2026-27", "2027-28", "2028-29"];

const PERIODS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

export default function DashboardStats({ receipts, onUpdate }: { receipts: Receipt[]; onUpdate: () => void }) {
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("active");

  // Filter receipts based on deleted status
  const activeReceipts = receipts.filter(r => !r.deleted_at);
  const deletedReceipts = receipts.filter(r => r.deleted_at);

  // Apply filters
  const filterByPeriod = (list: Receipt[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return list.filter(r => {
      const receiptDate = new Date(r.receipt_date);
      
      switch (filterPeriod) {
        case "today":
          return receiptDate >= today;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return receiptDate >= weekAgo;
        case "month":
          return receiptDate.getMonth() === now.getMonth() && 
                 receiptDate.getFullYear() === now.getFullYear();
        case "year":
          return receiptDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const applyFilters = (list: Receipt[]) => {
    let filtered = filterByPeriod(list);
    
    if (filterMonth !== "All") {
      filtered = filtered.filter(r => r.month === filterMonth);
    }
    
    if (filterYear !== "All") {
      filtered = filtered.filter(r => r.year === filterYear);
    }
    
    return filtered;
  };

  const filtered = applyFilters(activeTab === "active" ? activeReceipts : deletedReceipts);

  const totalStudents = filtered.length;
  const totalRevenue = filtered.reduce((s, r) => s + r.total_amount, 0);
  const totalGST = filtered.reduce((s, r) => s + r.cgst_amount + r.sgst_amount, 0);
  const totalPaid = filtered.reduce((s, r) => s + r.paid_amount, 0);

  const stats = [
    {
      title: "Total Receipts",
      value: totalStudents,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "GST Collected",
      value: `₹${totalGST.toLocaleString()}`,
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Paid",
      value: `₹${totalPaid.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to move this receipt to bin?")) return;
    
    try {
      const { error } = await supabase
        .from("receipts")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) {
        console.error("Delete error:", error);
        if (error.message.includes("column") && error.message.includes("deleted_at")) {
          alert("Database setup required! Please run the SQL migration first.\n\nCheck DATABASE_SETUP_INSTRUCTIONS.md file for details.");
        } else {
          alert(`Failed to delete receipt: ${error.message}`);
        }
        return;
      }
      
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting receipt:", error);
      alert(`Failed to delete receipt: ${error.message || "Unknown error"}`);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase
        .from("receipts")
        .update({ deleted_at: null })
        .eq("id", id);
      
      if (error) {
        console.error("Restore error:", error);
        alert(`Failed to restore receipt: ${error.message}`);
        return;
      }
      
      onUpdate();
    } catch (error: any) {
      console.error("Error restoring receipt:", error);
      alert(`Failed to restore receipt: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Financial Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} {filtered.length === 1 ? 'receipt' : 'receipts'} found
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions Table with Tabs */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Active ({activeReceipts.length})
              </TabsTrigger>
              <TabsTrigger value="bin" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Bin ({deletedReceipts.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b">
                  <th className="p-3 text-left font-semibold">#</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Student</th>
                  <th className="p-3 text-left font-semibold">Program</th>
                  <th className="p-3 text-left font-semibold">Month</th>
                  <th className="p-3 text-left font-semibold">Year</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                        <p className="font-medium">No receipts found</p>
                        <p className="text-xs">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className={`border-b hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="p-3 font-medium">{r.receipt_number}</td>
                      <td className="p-3 text-muted-foreground text-xs">{r.receipt_date}</td>
                      <td className="p-3 font-medium">{r.student_name}</td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">
                        {r.program}
                      </td>
                      <td className="p-3 text-xs">{r.month}</td>
                      <td className="p-3 text-xs">{r.year}</td>
                      <td className="p-3 text-right font-semibold">
                        ₹{r.total_amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {activeTab === "active" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(r.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(r.id)}
                            className="text-green-600 hover:text-green-600 hover:bg-green-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filtered.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="font-medium">No receipts found</p>
                  <p className="text-xs">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">#{r.receipt_number}</p>
                        <p className="text-xs text-muted-foreground">{r.receipt_date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeTab === "active" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(r.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(r.id)}
                            className="text-green-600 hover:text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-foreground mb-1">{r.student_name}</p>
                    <p className="text-xs text-muted-foreground mb-2 truncate">{r.program}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {r.month}
                      </span>
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                        {r.year}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-lg">₹{r.total_amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
