import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=oauth_error`);
  }

  if (!code) {
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.googleAds.clientId,
        client_secret: config.googleAds.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userResponse.json();

    // Sign in or sign up user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.nextUrl.origin}/dashboard`,
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=auth_failed`);
    }

    // Store Google Ads tokens (this would normally be done after user is authenticated)
    // For now, we'll store in session storage via redirect
    const params = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '',
      expires_in: tokens.expires_in?.toString() || '3600',
      user_email: userInfo.email,
      user_name: userInfo.name,
    });

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard/connect-google-ads?${params.toString()}`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=callback_failed`);
  }
}