import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin, hash } = new URL(request.url)
  
  // Check for both code (PKCE flow) and direct tokens (implicit flow)
  const code = searchParams.get('code')
  const accessToken = searchParams.get('access_token')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('OAuth callback received:', { 
    code: !!code, 
    accessToken: !!accessToken, 
    next, 
    origin,
    fullUrl: request.url 
  })

  // Handle PKCE flow (with code)
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        console.log('PKCE OAuth success, redirecting to:', `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('PKCE OAuth exchange error:', error)
        return NextResponse.redirect(`${origin}/login?error=pkce_failed&message=${encodeURIComponent(error?.message || 'Unknown error')}`)
      }
    } catch (err) {
      console.error('PKCE OAuth callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=pkce_callback_failed`)
    }
  }

  // Handle implicit flow (with access_token in URL fragments)
  // Since URL fragments aren't sent to server, we need to handle this client-side
  // Let's redirect to a client-side handler
  console.log('No code found, checking for client-side token handling')
  return NextResponse.redirect(`${origin}/auth/handle-tokens${next ? `?next=${encodeURIComponent(next)}` : ''}`)
}