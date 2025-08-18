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

export default function ClickFraudPage() {
  const { session } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [fraudData, setFraudData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("");

  const fetchRealFraudData = async () => {
    if (!session?.provider_refresh_token) {
      setError("No Google Ads connection found. Please re-authenticate.");
      setLoading(false);
      return;
    }
    if (!customerId) {
      setError("Google Ads Customer ID is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching real fraud detection data...");

      const response = await fetch("/api/google-ads/fraud-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: session.provider_refresh_token,
          customerId: customerId.replace(/-/g, ""),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fraud detection data received:", data);
        setFraudData(data);
        localStorage.setItem("google_ads_customer_id", customerId);
        setIsConnected(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch fraud data:", errorData);
        setError(
          errorData.details || errorData.error || "Failed to analyze fraud data"
        );
        setIsConnected(false);
      }
    } catch (err: any) {
      console.error("Error fetching fraud data:", err);
      setError("A network error occurred while fetching fraud data.");
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("google_ads_customer_id");
    if (session?.provider_refresh_token && storedCustomerId) {
      console.log("Existing connection found.");
      setCustomerId(storedCustomerId);
      setIsConnected(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session]);

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
              onClick={fetchRealFraudData}
              disabled={!customerId || loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading
                ? "🔍 Analyzing Account..."
                : "🚀 Analyze for Click Fraud"}
            </Button>
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔒 Your credentials are encrypted and secure.</p>
              <p>📊 We use read-only access to analyze your campaign data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            🔍 Analyzing Your Google Ads Data
          </h2>
          <p className="text-gray-600">
            Our AI is detecting fraud patterns in your campaigns...
          </p>
        </div>
      </div>
    );
  }

  if (error && !fraudData) {
    return (
      <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              ❌ Analysis Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => {
                setIsConnected(false);
                setError(null);
              }}
              variant="outline"
            >
              🔄 Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {fraudData && (
        <>
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              title="Threats Blocked"
              value={fraudData.analysis.totalAlerts.toString()}
              change={`${fraudData.analysis.highRiskAlerts} high risk`}
              trend="up"
              gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            />
            <KpiCard
              title="Potential Budget Saved"
              value={`$${fraudData.analysis.summary.totalCost.toFixed(0)}`}
              change="over 7 days"
              trend="up"
              gradient="linear-gradient(135deg, #10b981, #059669)"
            />
            <KpiCard
              title="Total Clicks Analyzed"
              value={fraudData.analysis.summary.totalClicks.toLocaleString()}
              change="in the last week"
              trend="up"
              gradient="linear-gradient(135deg, #f59e0b, #d97706)"
            />
            <KpiCard
              title="Overall Risk Level"
              value={
                fraudData.analysis.riskLevel.charAt(0).toUpperCase() +
                fraudData.analysis.riskLevel.slice(1)
              }
              change="based on alerts"
              trend={fraudData.analysis.riskLevel === "low" ? "down" : "up"}
              gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
            />
            <KpiCard
              title="Average CPC"
              value={`$${fraudData.analysis.summary.avgCPC.toFixed(2)}`}
              change="across campaigns"
              trend="down"
              gradient="linear-gradient(135deg, #06b6d4, #0891b2)"
            />
          </div>
          {/* You can add more dashboard components here using `fraudData` */}
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value, change, trend, gradient }: any) {
  return (
    <Card
      className="overflow-hidden border-2 shadow-lg"
      style={{ background: gradient }}
    >
      <CardContent className="p-6 text-white">
        <div className="text-sm font-medium opacity-90 mb-2">{title}</div>
        <div className="text-4xl font-bold mb-2">{value}</div>
        <div className="flex items-center text-sm opacity-90">
          {trend === "up" ? (
            <span className="text-green-200 mr-1">▲</span>
          ) : (
            <span className="text-red-200 mr-1">▼</span>
          )}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}
