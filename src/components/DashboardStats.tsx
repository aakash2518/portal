import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Users, IndianRupee, Receipt, TrendingUp, FileText } from "lucide-react";

interface Receipt {
  id: string;
  receipt_number: number;
  student_name: string;
  parent_name: string;
  month: string;
  total_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  paid_amount: number;
  receipt_date: string;
  program: string;
}

const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DashboardStats({ receipts }: { receipts: Receipt[] }) {
  const [filterMonth, setFilterMonth] = useState("All");

  const filtered = filterMonth === "All" ? receipts : receipts.filter((r) => r.month === filterMonth);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Financial Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filterMonth === "All" ? "All time statistics" : `Statistics for ${filterMonth}`}
          </p>
        </div>
        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
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

      {/* Transactions Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filtered.length} {filtered.length === 1 ? 'receipt' : 'receipts'} found
              </p>
            </div>
          </div>
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
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-right font-semibold">GST</th>
                  <th className="p-3 text-right font-semibold">Paid</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                        <p className="font-medium">No receipts found</p>
                        <p className="text-xs">Try selecting a different month or create a new receipt</p>
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
                      <td className="p-3 text-muted-foreground">{r.receipt_date}</td>
                      <td className="p-3 font-medium">{r.student_name}</td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {r.program}
                      </td>
                      <td className="p-3">{r.month}</td>
                      <td className="p-3 text-right font-semibold">
                        ₹{r.total_amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        ₹{(r.cgst_amount + r.sgst_amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-semibold text-green-600">
                        ₹{r.paid_amount.toLocaleString()}
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
                  <p className="text-xs">Try selecting a different month</p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">#{r.receipt_number}</p>
                        <p className="text-sm text-muted-foreground">{r.receipt_date}</p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {r.month}
                      </span>
                    </div>
                    <p className="font-medium text-foreground mb-1">{r.student_name}</p>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{r.program}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold">₹{r.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">GST</p>
                        <p className="font-medium">₹{(r.cgst_amount + r.sgst_amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-semibold text-green-600">₹{r.paid_amount.toLocaleString()}</p>
                      </div>
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
