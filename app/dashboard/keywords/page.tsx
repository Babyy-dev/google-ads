"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGoogleAds, NegativeKeywordAnalysis } from "@/hooks/useGoogleAds";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";

const initialAnalysis: NegativeKeywordAnalysis = {
  totalSearchTerms: 0,
  suggestedNegatives: 0,
  potentialMonthlySavings: 0,
  wastedClicks: 0,
  topBadTerms: [],
  suggestions: [],
};

export default function KeywordsPage() {
  const { session } = useAuth();
  const { analyzeNegativeKeywords, addNegativeKeywords, loading, error } =
    useGoogleAds();
  const [analysis, setAnalysis] =
    useState<NegativeKeywordAnalysis>(initialAnalysis);
  const [customerId, setCustomerId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("google_ads_customer_id");
    if (session?.provider_refresh_token && storedCustomerId) {
      setCustomerId(storedCustomerId);
      setIsConnected(true);
      handleAnalyze(storedCustomerId);
    }
  }, [session]);

  const handleAnalyze = async (id: string) => {
    if (!session?.provider_refresh_token) return;
    try {
      const result = await analyzeNegativeKeywords(
        id.replace(/-/g, ""),
        session.provider_refresh_token
      );
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = () => {
    if (!customerId) return;
    localStorage.setItem("google_ads_customer_id", customerId);
    setIsConnected(true);
    handleAnalyze(customerId);
  };

  const handleAddKeywords = async (adGroupId: string, keywords: string[]) => {
    if (!session?.provider_refresh_token) return;
    try {
      await addNegativeKeywords(
        customerId.replace(/-/g, ""),
        session.provider_refresh_token,
        adGroupId,
        keywords
      );
      // You can add a success message here
    } catch (e) {
      console.error(e);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🛡️ Connect to Google Ads</CardTitle>
            <CardDescription>
              Enter your Google Ads Customer ID to analyze keywords.
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
              {loading ? "🔍 Analyzing Keywords..." : "🚀 Analyze Keywords"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Negative Keyword Analysis</CardTitle>
          <CardDescription>
            Review suggested negative keywords to improve your campaign
            performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>Total Search Terms: {analysis.totalSearchTerms}</div>
            <div>Suggested Negatives: {analysis.suggestedNegatives}</div>
            <div>
              Potential Monthly Savings: ${analysis.potentialMonthlySavings}
            </div>
            <div>Wasted Clicks: {analysis.wastedClicks}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Wasted Spend Search Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Search Term</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Group</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.topBadTerms.map((term, index) => (
                <TableRow key={index}>
                  <TableCell>{term.searchTerm}</TableCell>
                  <TableCell>${term.cost}</TableCell>
                  <TableCell>{term.clicks}</TableCell>
                  <TableCell>{term.conversions}</TableCell>
                  <TableCell>{term.campaign}</TableCell>
                  <TableCell>{term.adGroup}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleAddKeywords(term.adGroup, [term.searchTerm])
                      }
                    >
                      Add as Negative
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
