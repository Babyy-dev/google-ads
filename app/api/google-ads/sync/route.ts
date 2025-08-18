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
        {
          error:
            "Missing required parameters: customerId and refreshToken are required.",
        },
        { status: 400 }
      );
    }

    const googleAds = new GoogleAdsService({
      client_id: config.googleAds.clientId,
      client_secret: config.googleAds.clientSecret,
      developer_token: config.googleAds.developerToken,
    });

    await googleAds.connectToCustomer(
      customerId.replace(/-/g, ""),
      refreshToken
    );

    const clickData = await googleAds.getClickPerformance("LAST_7_DAYS");
    const fraudAlerts = googleAds.analyzeClickFraud(clickData);

    const totalClicks = clickData.reduce((sum, data) => sum + data.clicks, 0);
    const totalCost = clickData.reduce((sum, data) => sum + data.cost, 0);
    const totalConversions = clickData.reduce(
      (sum, data) => sum + data.conversions,
      0
    );

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
