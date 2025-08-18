import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";

export default function BillingPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Billing Overview KPIs */}
      <div className="lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BillingKpi 
          title="💰 Current Month" 
          value="$149.00" 
          description="Usage this month"
          gradient="linear-gradient(135deg, #10b981, #059669)" 
        />
        <BillingKpi 
          title="📊 Usage Rate" 
          value="73%" 
          description="of plan limit"
          gradient="linear-gradient(135deg, #f59e0b, #d97706)" 
        />
        <BillingKpi 
          title="💳 Next Billing" 
          value="Feb 15" 
          description="Auto-renewal"
          gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)" 
        />
        <BillingKpi 
          title="💎 Total Saved" 
          value="$2.4k" 
          description="vs manual mgmt"
          gradient="linear-gradient(135deg, #06b6d4, #0891b2)" 
        />
      </div>

      {/* Current Plan */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>🚀 Current Subscription</CardTitle>
              <CardDescription>Your active plan and usage details</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">✅ Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Plan Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-800">Professional Plan</h3>
                  <span className="text-2xl font-bold text-blue-600">$149/mo</span>
                </div>
                <div className="text-sm text-blue-600 space-y-1">
                  <div>✅ Up to 100K ad clicks/month</div>
                  <div>✅ Advanced fraud detection</div>
                  <div>✅ Real-time monitoring</div>
                  <div>✅ Priority support</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  🔄 Upgrade Plan
                </Button>
                <Button variant="outline" className="flex-1">⚙️ Manage</Button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-4">
              <div className="space-y-3">
                <UsageBar label="Ad Clicks Monitored" used={73000} total={100000} />
                <UsageBar label="Fraud Detections" used={2847} total={5000} />
                <UsageBar label="API Calls" used={45600} total={100000} />
                <UsageBar label="Data Storage" used={8.4} total={50} unit="GB" />
              </div>
              
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="text-sm font-medium text-green-800">💡 Usage Optimization</div>
                <div className="text-xs text-green-600 mt-1">
                  You&apos;re efficiently using 73% of your plan. Consider upgrading if you consistently exceed 80%.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>💎 Available Plans</CardTitle>
          <CardDescription>Compare and upgrade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {planOptions.map((plan, i) => (
              <PlanOption key={i} plan={plan} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>📈 Usage Analytics</CardTitle>
          <CardDescription>Monthly usage trends and forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <LineChart
              data={usageData}
              series={[
                { key: "usage", name: "Monthly Usage ($)", color: "#10b981" },
                { key: "savings", name: "Cost Savings ($)", color: "#8b5cf6" }
              ]}
              height={300}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>💸 Cost Breakdown</CardTitle>
          <CardDescription>This month&apos;s charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart
              data={costBreakdown}
              series={[
                { key: "amount", name: "Cost ($)", color: "#f59e0b" }
              ]}
              height={300}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>💳 Payment History & Invoices</CardTitle>
              <CardDescription>Transaction history and downloadable invoices</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">📧 Email Receipt</Button>
              <Button variant="outline" size="sm">📄 Download All</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>📅 Date</TableHead>
                <TableHead>📋 Description</TableHead>
                <TableHead>💰 Amount</TableHead>
                <TableHead>💳 Method</TableHead>
                <TableHead>📊 Status</TableHead>
                <TableHead className="text-right">📄 Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment, i) => (
                <TableRow key={i} className="hover:bg-green-50/50">
                  <TableCell className="font-mono text-sm">{payment.date}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.description}</div>
                      <div className="text-xs text-foreground/60">{payment.period}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">${payment.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{payment.method.icon}</span>
                      <span className="text-sm">{payment.method.type}</span>
                      <span className="text-xs text-foreground/50">•••• {payment.method.last4}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Pending' ? 'warning' : 'destructive'}>
                      {payment.status === 'Paid' ? '✅' : payment.status === 'Pending' ? '⏳' : '❌'} {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      📥 Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-left">
              💡 All payments are processed securely. Invoices are generated automatically and emailed to your account.
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingKpi({ title, value, description, gradient }: { 
  title: string; 
  value: string; 
  description: string;
  gradient: string; 
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: gradient, opacity: 0.1 }}></div>
      <CardContent className="relative p-4">
        <div className="text-xs font-medium text-foreground/70 mb-1">{title}</div>
        <div className="text-2xl font-bold text-foreground mb-2">{value}</div>
        <div className="text-xs text-foreground/60">{description}</div>
      </CardContent>
    </Card>
  );
}

function UsageBar({ label, used, total, unit = "" }: { 
  label: string; 
  used: number; 
  total: number; 
  unit?: string; 
}) {
  const percentage = Math.round((used / total) * 100);
  const isHigh = percentage > 80;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={`font-semibold ${isHigh ? 'text-red-600' : 'text-green-600'}`}>
          {used.toLocaleString()}{unit} / {total.toLocaleString()}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${isHigh ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-foreground/60">{percentage}% used</div>
    </div>
  );
}

function PlanOption({ plan }: { plan: typeof planOptions[0] }) {
  return (
    <div className={`p-3 rounded-lg border-2 ${plan.current ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{plan.name}</span>
          {plan.current && <Badge variant="default" className="text-xs">Current</Badge>}
          {plan.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
        </div>
        <span className="font-bold text-lg">{plan.price}</span>
      </div>
      <div className="text-xs text-foreground/60 mb-2">{plan.description}</div>
      <div className="text-xs space-y-1">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {!plan.current && (
        <Button size="sm" className="w-full mt-3" variant={plan.popular ? "default" : "outline"}>
          {plan.popular ? "🚀 Upgrade" : "Select Plan"}
        </Button>
      )}
    </div>
  );
}

const planOptions = [
  {
    name: "Starter",
    price: "$49/mo",
    description: "Perfect for small campaigns",
    current: false,
    popular: false,
    features: ["10K clicks/month", "Basic fraud detection", "Email support"]
  },
  {
    name: "Professional",
    price: "$149/mo", 
    description: "For growing businesses",
    current: true,
    popular: true,
    features: ["100K clicks/month", "Advanced fraud detection", "Priority support", "Real-time alerts"]
  },
  {
    name: "Enterprise",
    price: "$499/mo",
    description: "For large organizations",
    current: false,
    popular: false,
    features: ["Unlimited clicks", "Custom AI models", "Dedicated support", "API access"]
  }
];

const usageData = [
  { label: "Oct", usage: 89, savings: 234 },
  { label: "Nov", usage: 124, savings: 456 },
  { label: "Dec", usage: 149, savings: 678 },
  { label: "Jan", usage: 149, savings: 892 },
  { label: "Feb", usage: 156, savings: 934 },
  { label: "Mar", usage: 167, savings: 1123 },
];

const costBreakdown = [
  { label: "Base Plan", amount: 149 },
  { label: "Overage", amount: 23 },
  { label: "Priority Support", amount: 15 },
  { label: "API Calls", amount: 8 },
  { label: "Storage", amount: 4 },
];

const paymentHistory = [
  {
    date: "2025-01-15",
    description: "Professional Plan",
    period: "Jan 15 - Feb 14, 2025",
    amount: "149.00",
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  },
  {
    date: "2024-12-15", 
    description: "Professional Plan",
    period: "Dec 15, 2024 - Jan 14, 2025",
    amount: "149.00",
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  },
  {
    date: "2024-11-15",
    description: "Professional Plan + Overage",
    period: "Nov 15 - Dec 14, 2024", 
    amount: "172.50",
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  },
  {
    date: "2024-10-15",
    description: "Professional Plan",
    period: "Oct 15 - Nov 14, 2024",
    amount: "149.00", 
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  },
  {
    date: "2024-09-15",
    description: "Starter Plan",
    period: "Sep 15 - Oct 14, 2024",
    amount: "49.00",
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  },
  {
    date: "2024-08-15",
    description: "Starter Plan", 
    period: "Aug 15 - Sep 14, 2024",
    amount: "49.00",
    method: { icon: "💳", type: "Visa", last4: "4242" },
    status: "Paid" as const
  }
];

