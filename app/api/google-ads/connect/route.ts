import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, accessToken, refreshToken, accountName, currencyCode } = body;

    if (!customerId || !accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: customerId, accessToken, refreshToken' },
        { status: 400 }
      );
    }

    // Get the current user (in a real app, you'd get this from the session)
    // For now, we'll use a mock user ID - in production this would come from the authenticated session
    const mockUserId = '554e0644-df19-4152-a0fd-c0633c1b8c57'; // This should be the actual authenticated user's ID

    // Calculate token expiration (typically 1 hour for access tokens)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Insert or update the Google Ads account connection
    const { data, error } = await supabase
      .from('google_ads_accounts')
      .upsert({
        user_id: mockUserId,
        customer_id: customerId,
        account_name: accountName || `Google Ads Account ${customerId}`,
        currency_code: currencyCode || 'USD',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expires_at: expiresAt.toISOString(),
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,customer_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save Google Ads account connection', details: error.message },
        { status: 500 }
      );
    }

    // Trigger initial data sync (in background)
    try {
      await fetch(`${request.nextUrl.origin}/api/google-ads/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          refreshToken,
          googleAdsAccountId: data.id,
        }),
      });
    } catch (syncError) {
      console.warn('Initial sync failed, will retry later:', syncError);
    }

    return NextResponse.json({
      success: true,
      message: 'Google Ads account connected successfully',
      account: {
        id: data.id,
        customerId: data.customer_id,
        accountName: data.account_name,
        currencyCode: data.currency_code,
        isActive: data.is_active,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Connect API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process Google Ads connection', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Google Ads Connect API',
    description: 'Connect and manage Google Ads account integrations',
    endpoints: {
      POST: '/api/google-ads/connect'
    },
    parameters: {
      customerId: 'Google Ads customer ID',
      accessToken: 'OAuth access token',
      refreshToken: 'OAuth refresh token',
      accountName: 'Account display name (optional)',
      currencyCode: 'Account currency code (optional)'
    }
  });
}