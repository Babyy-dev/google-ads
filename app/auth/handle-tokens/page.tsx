"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HandleTokensPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleTokens = async () => {
      try {
        // Get the URL fragments (after #)
        const hash = window.location.hash.substring(1); // Remove the #
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const providerToken = params.get('provider_token'); // This is the Google Ads API token!
        
        console.log('Token handler received:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          providerToken: !!providerToken,
          expiresIn
        });

        if (accessToken && refreshToken) {
          setStatus('Setting up your session...');
          
          // Set the session using the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session setup error:', error);
            setStatus('Authentication failed. Redirecting...');
            setTimeout(() => router.push('/login?error=session_failed'), 2000);
            return;
          }

          if (data.session) {
            console.log('Session established successfully!', data.session.user.email);
            
            // Store the Google Ads provider token if available
            if (providerToken && data.session.user) {
              console.log('Storing Google Ads provider token...');
              // You can store this in your database or local storage for Google Ads API calls
              localStorage.setItem('google_ads_token', providerToken);
              localStorage.setItem('google_ads_token_expires', (Date.now() + (parseInt(expiresIn || '3600') * 1000)).toString());
            }

            setStatus('Success! Redirecting to dashboard...');
            
            // Get the next parameter or default to dashboard
            const next = searchParams?.get('next') || '/dashboard';
            setTimeout(() => router.push(next), 1000);
          } else {
            setStatus('Session creation failed. Redirecting...');
            setTimeout(() => router.push('/login?error=no_session'), 2000);
          }
        } else {
          console.error('Missing tokens in URL fragments');
          setStatus('Authentication tokens missing. Redirecting...');
          setTimeout(() => router.push('/login?error=missing_tokens'), 2000);
        }
      } catch (error) {
        console.error('Token handling error:', error);
        setStatus('Authentication error occurred. Redirecting...');
        setTimeout(() => router.push('/login?error=token_processing_failed'), 2000);
      }
    };

    // Small delay to ensure the URL is fully loaded
    setTimeout(handleTokens, 100);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-2xl font-bold mb-4">Completing Authentication</h1>
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          <span className="text-gray-600">{status}</span>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>🔒 Securing your session</p>
          <p>🎯 Connecting to Google Ads</p>
          <p>📊 Preparing your dashboard</p>
        </div>
      </div>
    </div>
  );
}