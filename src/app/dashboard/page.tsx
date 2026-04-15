"use client";

import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const { data, error } = await supabase
          .from("receipts")
          .select("*")
          .order("receipt_number", { ascending: false });
        
        if (error) throw error;
        if (data) setReceipts(data);
      } catch (err) {
        console.error("Error fetching receipts:", err);
        setError("Failed to load receipts. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all fee receipts and transactions
          </p>
        </div>

        {loading ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-destructive mb-4 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <DashboardStats receipts={receipts} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
