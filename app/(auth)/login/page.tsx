"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/branding/logo";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="justify-center mb-6" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-foreground/70">Sign in to your AdShield dashboard</p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Sign in with Google</h2>
                <p className="text-foreground/70 text-sm">
                  We use Google authentication to securely connect to your Google Ads account
                </p>
              </div>

              <Button 
                onClick={signInWithGoogle}
                className="w-full h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              >
                <svg className="size-6 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                🚀 Continue with Google
              </Button>

              <div className="mt-6 text-center">
                <div className="text-xs text-foreground/60 space-y-1">
                  <p>🔒 Secure OAuth 2.0 authentication</p>
                  <p>✅ We only access your Google Ads data</p>
                  <p>🛡️ Your credentials are never stored</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-foreground/70">
                                      Don&apos;t have an account?{" "}
                  <Link 
                    className="font-medium text-primary hover:text-primary/80 underline underline-offset-4" 
                    href="/signup"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-xs text-foreground/50">
              <Link href="#" className="hover:text-foreground/70">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground/70">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground/70">Help Center</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Marketing Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.94_0.08_260/.3),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.95_0.13_145/.3),transparent_50%)]"></div>
        <div className="relative z-10 max-w-md text-center p-8">
          <div className="mb-8">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              🛡️ Trusted by 1,000+ advertisers
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Stop losing money to click fraud
            </h2>
            <p className="text-foreground/70 text-lg">
              Our AI detects and blocks fraudulent clicks automatically, saving you 20-40% on ad spend.
            </p>
          </div>

          <div className="grid gap-4">
            <TestimonialPreview 
              quote="AdShield saved us $12,000 in the first month"
              author="Sarah Chen, TechFlow Inc"
              avatar="👩‍💼"
            />
            <TestimonialPreview 
              quote="Our CPA dropped 35% after implementing AdShield"
              author="Mike Rodriguez, GrowthLab"
              avatar="👨‍💻"
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">1,283</div>
              <div className="text-xs text-foreground/60">IPs Blocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">$2.4M</div>
              <div className="text-xs text-foreground/60">Saved Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">99.7%</div>
              <div className="text-xs text-foreground/60">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialPreview({ quote, author, avatar }: { 
  quote: string; 
  author: string; 
  avatar: string; 
}) {
  return (
    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-foreground/10">
      <div className="flex items-start gap-3">
        <div className="text-lg">{avatar}</div>
        <div className="flex-1 text-left">
          <p className="text-sm text-foreground/80 italic">&ldquo;{quote}&rdquo;</p>
          <p className="text-xs text-foreground/60 mt-1">{author}</p>
        </div>
      </div>
    </div>
  );
}

