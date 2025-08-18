import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,oklch(0.94_0.08_260/.6),transparent_60%),radial-gradient(1000px_500px_at_80%_-20%,oklch(0.95_0.13_145/.5),transparent_60%),radial-gradient(800px_400px_at_50%_100%,oklch(0.96_0.10_40/.4),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              🛡️ Trusted by 1,000+ advertisers
            </Badge>
            <h1 className="text-pretty text-6xl font-bold tracking-tight sm:text-7xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Stop wasting ad money.
            </h1>
            <p className="mt-6 text-xl text-foreground/80 leading-relaxed">
              AdShield uses AI to detect click fraud, block bad traffic, and optimize your Google Ads automatically. Save 20-40% on ad spend.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  🚀 Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 border-2">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
              <LiveBadge label="Blocked IPs" value="1,283" trend="+47" color="oklch(0.82 0.16 260)" />
              <LiveBadge label="Saved Today" value="$2,847" trend="+12%" color="oklch(0.78 0.15 145)" />
              <LiveBadge label="Fraud Rate" value="3.1%" trend="-0.8%" color="oklch(0.83 0.13 20)" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            <div className="relative rounded-2xl border border-[color-mix(in_oklab,currentColor_10%,transparent)] bg-background/80 backdrop-blur-sm p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-yellow-500"></div>
                <div className="size-3 rounded-full bg-green-500"></div>
                <div className="ml-auto text-xs text-foreground/60">Live Dashboard</div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <DashboardStat label="Active Campaigns" value="24" icon="📊" />
                <DashboardStat label="Keywords Blocked" value="5,432" icon="🚫" />
                <DashboardStat label="Alerts Today" value="9" icon="⚠️" />
                <DashboardStat label="Bot Attacks" value="137" icon="🤖" />
                <DashboardStat label="CTR Improvement" value="+18%" icon="📈" />
                <DashboardStat label="CPA Reduction" value="-23%" icon="💰" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Your ads are under attack</h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Click fraud costs advertisers $65 billion annually. Bots, competitors, and accidental clicks are draining your budget right now.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <ProblemCard 
            icon="🤖" 
            title="Bot Traffic" 
            problem="Up to 40% of your clicks are fake"
            solution="AI detection blocks bots instantly"
            gradient="linear-gradient(135deg, oklch(0.96_0.08_260), oklch(0.92_0.12_145))"
          />
          <ProblemCard 
            icon="🔄" 
            title="Click Farms" 
            problem="Competitors waste your budget"
            solution="IP tracking stops repeat offenders"
            gradient="linear-gradient(135deg, oklch(0.96_0.08_145), oklch(0.92_0.12_20))"
          />
          <ProblemCard 
            icon="💸" 
            title="Bad Keywords" 
            problem="Irrelevant searches cost money"
            solution="Auto-blocking saves 20-30%"
            gradient="linear-gradient(135deg, oklch(0.96_0.08_20), oklch(0.92_0.12_260))"
          />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">✨ Powerful Features</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need to protect your ads</h2>
          <p className="text-xl text-foreground/70">Advanced AI protection that works 24/7</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            icon="🛡️"
            title="Real-Time Fraud Detection"
            desc="Advanced ML algorithms analyze every click in milliseconds to identify and block suspicious activity."
            features={["Bot signature detection", "Behavioral analysis", "IP reputation scoring"]}
          />
          <FeatureCard 
            icon="🚫"
            title="Automated Keyword Blocking"
            desc="AI continuously analyzes search terms and automatically adds negative keywords to prevent wasted spend."
            features={["Smart pattern recognition", "Auto-negative lists", "Campaign optimization"]}
          />
          <FeatureCard 
            icon="📊"
            title="Advanced Analytics"
            desc="Comprehensive dashboards show exactly how much money you're saving and where threats are coming from."
            features={["Real-time monitoring", "Threat intelligence", "ROI tracking"]}
          />
          <FeatureCard 
            icon="⚡"
            title="Instant Alerts"
            desc="Get notified immediately when budget anomalies or attack patterns are detected."
            features={["SMS & email alerts", "Slack integration", "Custom thresholds"]}
          />
          <FeatureCard 
            icon="🔧"
            title="Easy Integration"
            desc="Connect your Google Ads account in under 2 minutes with our secure API integration."
            features={["One-click setup", "Secure OAuth", "Multi-account support"]}
          />
          <FeatureCard 
            icon="🎯"
            title="Smart Optimization"
            desc="Automatically optimize campaigns based on fraud patterns and performance data."
            features={["Bid adjustments", "Audience refinement", "Budget allocation"]}
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Trusted by top advertisers</h2>
          <p className="text-xl text-foreground/70">See what our customers are saying</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard 
            quote="AdShield saved us $12,000 in the first month alone. The click fraud was worse than we thought."
            author="Sarah Chen"
            title="Marketing Director"
            company="TechFlow Inc"
            avatar="👩‍💼"
            savings="$12,000"
          />
          <TestimonialCard 
            quote="Finally, a tool that actually works. Our CPA dropped 35% after implementing AdShield."
            author="Mike Rodriguez"
            title="PPC Manager"
            company="GrowthLab"
            avatar="👨‍💻"
            savings="35% CPA reduction"
          />
          <TestimonialCard 
            quote="The automated negative keywords feature alone pays for itself. Incredible ROI."
            author="Lisa Park"
            title="CEO"
            company="StartupXYZ"
            avatar="👩‍🚀"
            savings="400% ROI"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">💰 Simple Pricing</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Plans that scale with you</h2>
          <p className="text-xl text-foreground/70">Start free, upgrade when you need more</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <PricingCard 
            name="Starter"
            price="Free"
            period=""
            description="Perfect for small businesses getting started"
            features={[
              "Up to $1,000 ad spend/month",
              "Basic fraud detection",
              "Email alerts",
              "7-day data retention"
            ]}
            cta="Start Free"
            popular={false}
          />
          <PricingCard 
            name="Professional"
            price="$49"
            period="/month"
            description="For growing businesses with higher ad spend"
            features={[
              "Up to $10,000 ad spend/month",
              "Advanced AI detection",
              "SMS + Email alerts",
              "30-day data retention",
              "Priority support",
              "Custom rules"
            ]}
            cta="Start Free Trial"
            popular={true}
          />
          <PricingCard 
            name="Enterprise"
            price="$199"
            period="/month"
            description="For agencies and large advertisers"
            features={[
              "Unlimited ad spend",
              "White-label dashboard",
              "API access",
              "Unlimited data retention",
              "Dedicated support",
              "Custom integrations"
            ]}
            cta="Contact Sales"
            popular={false}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.94_0.08_260/.3),transparent_70%)]"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Stop losing money to click fraud</h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join 1,000+ advertisers who have saved over $2.4M with AdShield. Start your free trial today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-base px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl">
                  🚀 Start Free Trial - No Card Required
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8 py-6 border-2">
                  Sign in to Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-foreground/60">
              <span>✓ 14-day free trial</span>
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}



function LiveBadge({ label, value, trend, color }: { label: string; value: string; trend: string; color: string }) {
  return (
    <div className="rounded-lg border border-[color-mix(in_oklab,currentColor_10%,transparent)] p-4 bg-gradient-to-br from-background to-background/50">
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden className="size-3 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span className="text-xs text-foreground/70 font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-green-600 font-medium">↗ {trend}</div>
    </div>
  );
}

function DashboardStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg border border-[color-mix(in_oklab,currentColor_8%,transparent)] p-3 bg-gradient-to-br from-background/50 to-background/20">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-foreground/60 font-medium">{label}</span>
      </div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ProblemCard({ icon, title, problem, solution, gradient }: { 
  icon: string; 
  title: string; 
  problem: string; 
  solution: string; 
  gradient: string; 
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: gradient, opacity: 0.1 }}></div>
      <CardContent className="relative p-6">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-sm mt-0.5">❌</span>
            <span className="text-sm text-foreground/70">{problem}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-sm mt-0.5">✅</span>
            <span className="text-sm text-foreground font-medium">{solution}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, desc, features }: { 
  icon: string; 
  title: string; 
  desc: string; 
  features: string[]; 
}) {
  return (
    <Card className="relative h-full">
      <CardContent className="p-6">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-foreground/70 mb-4">{desc}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author, title, company, avatar, savings }: { 
  quote: string; 
  author: string; 
  title: string; 
  company: string; 
  avatar: string;
  savings: string;
}) {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            {savings} saved
          </Badge>
        </div>
        <div className="mb-4">
          <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
          <p className="text-foreground/80 italic">&ldquo;{quote}&rdquo;</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{avatar}</div>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-foreground/60">{title}</div>
            <div className="text-sm text-foreground/60">{company}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({ name, price, period, description, features, cta, popular }: { 
  name: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[]; 
  cta: string;
  popular: boolean;
}) {
  return (
    <Card className={`relative h-full ${popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <div className="mb-2">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-foreground/60">{period}</span>
          </div>
          <p className="text-sm text-foreground/70">{description}</p>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link href="/signup" className="block">
          <Button 
            className={`w-full ${popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
            variant={popular ? 'default' : 'outline'}
          >
            {cta}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
