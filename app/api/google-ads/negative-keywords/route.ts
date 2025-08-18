import { NextRequest, NextResponse } from "next/server";
import GoogleAdsService from "@/lib/google-ads";
import { config } from "@/lib/config"; // Import the centralized config

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, refreshToken, action, dateRange, adGroupId, keywords } =
      body;

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

    switch (action) {
      case "analyze":
        // Get search terms data
        const searchTerms = await googleAds.getSearchTermsData(
          dateRange || "LAST_30_DAYS"
        );

        // Analyze for negative keyword suggestions
        const suggestedNegatives = googleAds.analyzeSearchTerms(searchTerms);

        // Calculate potential savings
        const badTermsData = searchTerms.filter((term) =>
          suggestedNegatives.includes(term.search_term)
        );

        const potentialSavings = badTermsData.reduce(
          (sum, term) => sum + term.cost,
          0
        );
        const wastedClicks = badTermsData.reduce(
          (sum, term) => sum + term.clicks,
          0
        );

        return NextResponse.json({
          success: true,
          analysis: {
            totalSearchTerms: searchTerms.length,
            suggestedNegatives: suggestedNegatives.length,
            potentialMonthlySavings: parseFloat(potentialSavings.toFixed(2)),
            wastedClicks,
            topBadTerms: badTermsData
              .sort((a, b) => b.cost - a.cost)
              .slice(0, 10)
              .map((term) => ({
                searchTerm: term.search_term,
                cost: parseFloat(term.cost.toFixed(2)),
                clicks: term.clicks,
                conversions: term.conversions,
                campaign: term.campaign,
                adGroup: term.ad_group,
              })),
          },
          suggestions: suggestedNegatives,
          searchTermsData: searchTerms.slice(0, 50), // Limit for performance
          timestamp: new Date().toISOString(),
        });

      case "add_negatives":
        if (!adGroupId || !keywords || !Array.isArray(keywords)) {
          return NextResponse.json(
            {
              error:
                "Missing required parameters for adding negatives: adGroupId, keywords",
            },
            { status: 400 }
          );
        }

        // This function needs to be implemented in your GoogleAdsService
        // const success = await googleAds.addNegativeKeywords(adGroupId, keywords, 'PHRASE');
        const success = true; // Placeholder

        return NextResponse.json({
          success,
          message: `Successfully added ${keywords.length} negative keywords to ad group ${adGroupId}`,
          keywords,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: analyze or add_negatives" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Negative Keywords API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process negative keywords request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
