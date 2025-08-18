import { NextRequest, NextResponse } from 'next/server';
import GoogleAdsService from '@/lib/google-ads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, refreshToken, action, dateRange, adGroupId, keywords } = body;

    if (!customerId || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: customerId, refreshToken' },
        { status: 400 }
      );
    }

    // Initialize Google Ads service
    const googleAds = new GoogleAdsService({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    // Connect to customer account
    await googleAds.connectCustomer(customerId, refreshToken);

    switch (action) {
      case 'analyze':
        // Get search terms data
        const searchTerms = await googleAds.getSearchTermsData(dateRange || 'LAST_30_DAYS');
        
        // Analyze for negative keyword suggestions
        const suggestedNegatives = googleAds.analyzeSearchTerms(searchTerms);

        // Calculate potential savings
        const badTermsData = searchTerms.filter(term => 
          suggestedNegatives.includes(term.search_term)
        );
        
        const potentialSavings = badTermsData.reduce((sum, term) => sum + term.cost, 0);
        const wastedClicks = badTermsData.reduce((sum, term) => sum + term.clicks, 0);

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
              .map(term => ({
                searchTerm: term.search_term,
                cost: parseFloat(term.cost.toFixed(2)),
                clicks: term.clicks,
                conversions: term.conversions,
                campaign: term.campaign,
                adGroup: term.ad_group
              }))
          },
          suggestions: suggestedNegatives,
          searchTermsData: searchTerms.slice(0, 50), // Limit for performance
          timestamp: new Date().toISOString(),
        });

      case 'add_negatives':
        if (!adGroupId || !keywords || !Array.isArray(keywords)) {
          return NextResponse.json(
            { error: 'Missing required parameters for adding negatives: adGroupId, keywords' },
            { status: 400 }
          );
        }

        const success = await googleAds.addNegativeKeywords(adGroupId, keywords, 'PHRASE');
        
        return NextResponse.json({
          success,
          message: `Successfully added ${keywords.length} negative keywords to ad group ${adGroupId}`,
          keywords,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: analyze or add_negatives' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Negative Keywords API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process negative keywords request', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Google Ads Negative Keywords API',
    description: 'Analyzes search terms and manages negative keywords automatically',
    endpoints: {
      POST: '/api/google-ads/negative-keywords'
    },
    actions: {
      analyze: {
        description: 'Analyze search terms and suggest negative keywords',
        parameters: {
          customerId: 'Google Ads customer ID',
          refreshToken: 'OAuth refresh token',
          action: 'analyze',
          dateRange: 'LAST_7_DAYS | LAST_30_DAYS | TODAY (optional)'
        }
      },
      add_negatives: {
        description: 'Add negative keywords to an ad group',
        parameters: {
          customerId: 'Google Ads customer ID',
          refreshToken: 'OAuth refresh token',
          action: 'add_negatives',
          adGroupId: 'Target ad group ID',
          keywords: 'Array of negative keywords to add'
        }
      }
    },
    examples: {
      analyze: {
        customerId: '1234567890',
        refreshToken: 'your_refresh_token',
        action: 'analyze',
        dateRange: 'LAST_30_DAYS'
      },
      add_negatives: {
        customerId: '1234567890',
        refreshToken: 'your_refresh_token',
        action: 'add_negatives',
        adGroupId: '987654321',
        keywords: ['free', 'cheap', 'job']
      }
    }
  });
}