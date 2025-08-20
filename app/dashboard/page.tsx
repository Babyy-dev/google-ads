"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";

const initialDashboardData = {
  stats: {
    savedBudget: "$0",
    blockedIPs: "0",
    keywordsBlocked: "0",
    detectionRate: "0%",
  },
  charts: {
    fraudVsValid: [],
    budgetSavings: [],
  },
  recentAlerts: [],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(initialDashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      if (searchParams?.get("connected") === "true") {
        setIsConnected(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }

      const googleAdsToken = localStorage.getItem("google_ads_token");
      if (googleAdsToken) {
        setIsConnected(true);
        await fetchDashboardData();
      }
      setLoading(false);
    };

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          // If the API fails, we still have the initial data
          console.error("Failed to fetch dashboard data:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    initDashboard();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        {/* ... existing connect to Google Ads component */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {showSuccess && (
        <div className="md:col-span-3 mb-4">
          <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 mt-1">
              Connected as: <strong>{user?.email}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="md:col-span-3 grid gap-4 md:grid-cols-4">
        <Kpi title="Saved Budget" value={dashboardData.stats.savedBudget} />
        <Kpi title="Blocked IPs" value={dashboardData.stats.blockedIPs} />
        <Kpi
          title="Keywords Blocked"
          value={dashboardData.stats.keywordsBlocked}
        />
        <Kpi title="Detection Rate" value={dashboardData.stats.detectionRate} />
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>📊 Fraud vs Valid Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={dashboardData.charts.fraudVsValid}
              series={[
                { key: "Valid Clicks", name: "Valid Clicks", color: "#10b981" },
                {
                  key: "Fraud Blocked",
                  name: "Fraud Blocked",
                  color: "#ef4444",
                },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>💰 Budget Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={dashboardData.charts.budgetSavings}
              series={[
                { key: "Savings", name: "Budget Saved ($)", color: "#f59e0b" },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>🎯 Top Offending IPs & Fraud Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Fraud Type</TableHead>
                  <TableHead>Wasted Budget</TableHead>
                  <TableHead>Bad Clicks</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentAlerts.map((alert: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{alert.ip}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>{alert.cost}</TableCell>
                    <TableCell>{alert.clicks}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.risk === "High"
                            ? "destructive"
                            : alert.risk === "Medium"
                            ? "warning"
                            : "default"
                        }
                      >
                        {alert.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.status === "Blocked" ? "success" : "secondary"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-medium text-foreground/60 mb-1">
          {title}
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
