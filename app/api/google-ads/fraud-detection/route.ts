import { NextRequest, NextResponse } from "next/server";
import GoogleAdsService from "@/lib/google-ads";
import { config } from "@/lib/config";

function generateRecommendations(alerts: any[], budgetData: any[]): string[] {
  const recommendations: string[] = [];
  if (alerts.some((alert) => alert.type === "bot_pattern")) {
    recommendations.push(
      "Unusual click spikes detected. Review traffic sources and consider implementing IP exclusions for high-risk networks."
    );
  }
  if (alerts.some((alert) => alert.type === "budget_burn")) {
    recommendations.push(
      "High CPC with no conversions detected on multiple occasions. Review your keyword targeting and ad copy for relevance."
    );
  }
  const highBurnCampaign = budgetData.find((c) => c.burn_rate > 90);
  if (highBurnCampaign) {
    recommendations.push(
      `Campaign "${
        highBurnCampaign.campaign_name
      }" has a high budget burn rate (${highBurnCampaign.burn_rate.toFixed(
        1
      )}%). Monitor its performance closely.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Campaigns appear healthy. Continue monitoring for anomalies."
    );
  }
  return recommendations;
}

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

    await googleAds.connectToCustomer(customerId, refreshToken);

    const clickData = await googleAds.getClickPerformance("LAST_7_DAYS");
    const budgetData = await googleAds.getBudgetData();
    const fraudAlerts = googleAds.analyzeClickFraud(clickData);

    const totalClicks = clickData.reduce((sum, data) => sum + data.clicks, 0);
    const totalCost = clickData.reduce((sum, data) => sum + data.cost, 0);
    const totalConversions = clickData.reduce(
      (sum, data) => sum + data.conversions,
      0
    );
    const avgCPC = totalClicks > 0 ? totalCost / totalClicks : 0;
    const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;

    const highRiskAlerts = fraudAlerts.filter(
      (alert) => alert.severity === "high"
    ).length;
    const mediumRiskAlerts = fraudAlerts.filter(
      (alert) => alert.severity === "medium"
    ).length;

    let riskLevel: "low" | "medium" | "high" = "low";
    if (highRiskAlerts > 0) riskLevel = "high";
    else if (mediumRiskAlerts > 2) riskLevel = "medium";

    return NextResponse.json({
      success: true,
      analysis: {
        riskLevel,
        totalAlerts: fraudAlerts.length,
        highRiskAlerts,
        mediumRiskAlerts,
        summary: {
          totalClicks,
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalConversions,
          avgCPC: parseFloat(avgCPC.toFixed(2)),
          conversionRate: parseFloat((conversionRate * 100).toFixed(2)),
        },
      },
      alerts: fraudAlerts,
      budgetData,
      recommendations: generateRecommendations(fraudAlerts, budgetData),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Fraud Detection API Error:", error);
    let errorMessage = "Failed to analyze fraud patterns.";
    if (error.message.includes("AuthenticationError.OAUTH_TOKEN_REVOKED")) {
      errorMessage =
        "Your Google connection has expired. Please log out and sign in again.";
    } else if (error.message.includes("INVALID_CUSTOMER_ID")) {
      errorMessage =
        "The provided Customer ID is invalid. Please check and try again.";
    }

    return NextResponse.json(
      {
        error: "Error during fraud analysis.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
