"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { useAuth } from "@/lib/auth";
import { useGoogleAds, FraudAnalysis } from "@/hooks/useGoogleAds";

export default function ClickFraudPage() {
  const { session } = useAuth();
  const { analyzeFraud, loading, error } = useGoogleAds();
  const [isConnected, setIsConnected] = useState(false);
  const [fraudData, setFraudData] = useState<FraudAnalysis | null>(null);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("google_ads_customer_id");
    if (session?.provider_refresh_token && storedCustomerId) {
      setCustomerId(storedCustomerId);
      setIsConnected(true);
      fetchFraudData(storedCustomerId);
    }
  }, [session]);

  const fetchFraudData = async (id: string) => {
    if (!session?.provider_refresh_token) return;
    try {
      const data = await analyzeFraud(
        id.replace(/-/g, ""),
        session.provider_refresh_token
      );
      setFraudData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = () => {
    if (!customerId) return;
    localStorage.setItem("google_ads_customer_id", customerId);
    setIsConnected(true);
    fetchFraudData(customerId);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🛡️ Connect to Google Ads</CardTitle>
            <CardDescription>
              Enter your Google Ads Customer ID to begin fraud analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-left">
              <label
                htmlFor="customerId"
                className="text-sm font-medium text-gray-700"
              >
                Google Ads Customer ID (e.g., 123-456-7890)
              </label>
              <Input
                id="customerId"
                placeholder="Enter your 10-digit Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="mt-1 text-center text-lg tracking-wider"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <Button
              onClick={handleConnect}
              disabled={!customerId || loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading
                ? "🔍 Analyzing Account..."
                : "🚀 Analyze for Click Fraud"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading && !fraudData) {
    return <div>Loading fraud data...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {fraudData && (
        <>
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              title="Threats Blocked"
              value={fraudData.totalAlerts.toString()}
              change={`${fraudData.highRiskAlerts} high risk`}
            />
            <KpiCard
              title="Potential Budget Saved"
              value={`$${fraudData.summary.totalCost.toFixed(0)}`}
              change="over 7 days"
            />
            <KpiCard
              title="Total Clicks Analyzed"
              value={fraudData.summary.totalClicks.toLocaleString()}
              change="in the last week"
            />
            <KpiCard
              title="Overall Risk Level"
              value={
                fraudData.riskLevel.charAt(0).toUpperCase() +
                fraudData.riskLevel.slice(1)
              }
              change="based on alerts"
            />
            <KpiCard
              title="Average CPC"
              value={`$${fraudData.summary.avgCPC.toFixed(2)}`}
              change="across campaigns"
            />
          </div>
          {/* You can add more dashboard components here using `fraudData` */}
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value, change }: any) {
  return (
    <Card className="overflow-hidden border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="text-sm font-medium opacity-90 mb-2">{title}</div>
        <div className="text-4xl font-bold mb-2">{value}</div>
        <div className="flex items-center text-sm opacity-90">{change}</div>
      </CardContent>
    </Card>
  );
}
