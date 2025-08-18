// app/api/google-ads/sync/route.ts

import { NextRequest, NextResponse } from "next/server";
import GoogleAdsService from "@/lib/google-ads";
import { config } from "@/lib/config";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, refreshToken } = body;

    if (!customerId || !refreshToken) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const googleAds = new GoogleAdsService({
      client_id: config.googleAds.clientId,
      client_secret: config.googleAds.clientSecret,
      developer_token: config.googleAds.developerToken,
    });

    await googleAds.connectToCustomer(customerId, refreshToken);

    // Fetching data for the last 7 days to create a snapshot
    const clickData = await googleAds.getClickPerformance("LAST_7_DAYS");
    const budgetData = await googleAds.getBudgetData(); // Gets today's budget data
    const fraudAlerts = googleAds.analyzeClickFraud(clickData);

    // Calculate summary metrics
    const totalClicks = clickData.reduce((sum, data) => sum + data.clicks, 0);
    const totalCost = clickData.reduce((sum, data) => sum + data.cost, 0);
    const totalConversions = clickData.reduce(
      (sum, data) => sum + data.conversions,
      0
    );
    const fraudClicksDetected = fraudAlerts.filter(
      (alert) => alert.type === "bot_pattern"
    ).length;

    // In a real app, you would associate this with a user's account in your DB
    console.log("Data to be saved for snapshot:", {
      totalClicks,
      totalCost,
      totalConversions,
      fraudClicksDetected,
    });

    return NextResponse.json({
      success: true,
      message: "Data sync completed successfully",
      summary: {
        totalClicks,
        totalCost: parseFloat(totalCost.toFixed(2)),
        totalConversions,
        fraudAlertsGenerated: fraudAlerts.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync Google Ads data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
