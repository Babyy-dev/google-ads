"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";

export interface GoogleAdsAccount {
  customerId: string;
  name: string;
  currencyCode: string;
}

export interface FraudAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  totalAlerts: number;
  highRiskAlerts: number;
  mediumRiskAlerts: number;
  summary: {
    totalClicks: number;
    totalCost: number;
    totalConversions: number;
    avgCPC: number;
    conversionRate: number;
  };
  alerts: any[];
  recommendations: string[];
}

export interface NegativeKeywordAnalysis {
  totalSearchTerms: number;
  suggestedNegatives: number;
  potentialMonthlySavings: number;
  wastedClicks: number;
  topBadTerms: any[];
  suggestions: string[];
}

export function useGoogleAds() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock Google OAuth for now (will implement proper OAuth in Milestone 4)
  const connectGoogleAds = useCallback(async (): Promise<GoogleAdsAccount[]> => {
    setLoading(true);
    setError(null);

    try {
      // For now, return mock data since we need OAuth setup
      // In Milestone 4, this will trigger actual Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockAccounts: GoogleAdsAccount[] = [
        {
          customerId: "1234567890",
          name: "Demo Account - Digital Marketing Pro",
          currencyCode: "USD"
        }
      ];

      return mockAccounts;
    } catch (err: any) {
      setError(err.message || 'Failed to connect Google Ads account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get fraud analysis
  const analyzeFraud = useCallback(async (
    customerId: string, 
    refreshToken: string, 
    dateRange: string = 'LAST_7_DAYS'
  ): Promise<FraudAnalysis> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-ads/fraud-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          refreshToken,
          dateRange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze fraud patterns');
      }

      const data = await response.json();
      return data.analysis;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze fraud patterns');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get negative keyword analysis
  const analyzeNegativeKeywords = useCallback(async (
    customerId: string, 
    refreshToken: string, 
    dateRange: string = 'LAST_30_DAYS'
  ): Promise<NegativeKeywordAnalysis> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-ads/negative-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          refreshToken,
          action: 'analyze',
          dateRange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze negative keywords');
      }

      const data = await response.json();
      return data.analysis;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze negative keywords');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add negative keywords
  const addNegativeKeywords = useCallback(async (
    customerId: string,
    refreshToken: string,
    adGroupId: string,
    keywords: string[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-ads/negative-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          refreshToken,
          action: 'add_negatives',
          adGroupId,
          keywords,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add negative keywords');
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to add negative keywords');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get general reports
  const getReports = useCallback(async (
    customerId: string,
    refreshToken: string,
    reportType: 'click_performance' | 'search_terms' | 'budget_data',
    dateRange: string = 'LAST_7_DAYS'
  ): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-ads/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          refreshToken,
          reportType,
          dateRange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reports');
      }

      const data = await response.json();
      return data.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connectGoogleAds,
    analyzeFraud,
    analyzeNegativeKeywords,
    addNegativeKeywords,
    getReports,
  };
}