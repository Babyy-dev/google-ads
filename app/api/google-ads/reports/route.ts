import { NextRequest, NextResponse } from "next/server";
import GoogleAdsService from "@/lib/google-ads";
import { config } from "@/lib/config"; // Import the centralized config

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, refreshToken, reportType, dateRange } = body;

    if (!customerId || !refreshToken) {
      return NextResponse.json(
        { error: "Missing required parameters: customerId, refreshToken" },
        { status: 400 }
      );
    }

    // Initialize Google Ads service using the config object
    const googleAds = new GoogleAdsService({
      client_id: config.googleAds.clientId,
      client_secret: config.googleAds.clientSecret,
      developer_token: config.googleAds.developerToken,
    });

    // Connect to customer account
    await googleAds.connectToCustomer(
      customerId.replace(/-/g, ""),
      refreshToken
    );

    let data;
    switch (reportType) {
      case "click_performance":
        data = await googleAds.getClickPerformance(dateRange || "LAST_7_DAYS");
        break;
      case "search_terms":
        data = await googleAds.getSearchTermsData(dateRange || "LAST_30_DAYS");
        break;
      case "budget_data":
        data = await googleAds.getBudgetData();
        break;
      default:
        return NextResponse.json(
          {
            error:
              "Invalid report type. Use: click_performance, search_terms, or budget_data",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      reportType,
      dateRange: dateRange || "default",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Google Ads API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Google Ads data",
        details: error.message,
        type: error.name || "GoogleAdsError",
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "Google Ads Reports API",
    endpoints: {
      POST: "/api/google-ads/reports",
      parameters: {
        customerId: "string (required) - Google Ads customer ID",
        refreshToken: "string (required) - OAuth refresh token",
        reportType:
          "string (required) - click_performance | search_terms | budget_data",
        dateRange: "string (optional) - LAST_7_DAYS | LAST_30_DAYS | TODAY",
      },
    },
    example: {
      customerId: "1234567890",
      refreshToken: "your_refresh_token",
      reportType: "click_performance",
      dateRange: "LAST_7_DAYS",
    },
  });
}
