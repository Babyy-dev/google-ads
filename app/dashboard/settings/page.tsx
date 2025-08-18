"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    phone_number: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        company: profile.company || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      await updateProfile(formData);
      // Show success message (you could add a toast here)
      console.log('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        company: profile.company || '',
        phone_number: profile.phone_number || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Account Profile */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Account Profile</CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <Input 
                id="name" 
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="company">Company</label>
              <Input 
                id="company" 
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="phone">Phone Number</label>
              <Input 
                id="phone" 
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                🔄 Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>🔐 Security & Privacy</CardTitle>
          <CardDescription>Protect your account and data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-foreground/70">Add an extra layer of security</p>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-200">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-foreground/70">Get notified of new logins</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-foreground/70">Download your data</p>
              </div>
              <Button size="sm" variant="outline">📥 Export</Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                🔑 Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📱 Setup 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys & Integration */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>🔑 API Keys & Integration</CardTitle>
              <CardDescription>Manage API access and third-party integrations</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              ➕ Create New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Keep your API keys secure. Never share them in public repositories or client-side code.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>📛 Name</TableHead>
                <TableHead>🔑 Key</TableHead>
                <TableHead>📅 Created</TableHead>
                <TableHead>📊 Usage</TableHead>
                <TableHead>🔐 Permissions</TableHead>
                <TableHead>⚙️ Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Production API</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs">ak_live_51H7Zx2eZv...</code>
                </TableCell>
                <TableCell>2024-12-15</TableCell>
                <TableCell>
                  <span className="text-sm">45,672 <span className="text-muted-foreground">calls</span></span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">read</Badge>
                    <Badge variant="secondary" className="text-xs">write</Badge>
                    <Badge variant="secondary" className="text-xs">admin</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">👁️ View</Button>
                    <Button size="sm" variant="ghost" className="text-red-600">🗑️ Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Development Key</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs">ak_test_51H7Zx2eZv...</code>
                </TableCell>
                <TableCell>2024-11-28</TableCell>
                <TableCell>
                  <span className="text-sm">12,834 <span className="text-muted-foreground">calls</span></span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">read</Badge>
                    <Badge variant="secondary" className="text-xs">write</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">👁️ View</Button>
                    <Button size="sm" variant="ghost" className="text-red-600">🗑️ Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Analytics Only</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs">ak_read_51H7Zx2eZv...</code>
                </TableCell>
                <TableCell>2024-10-05</TableCell>
                <TableCell>
                  <span className="text-sm">8,921 <span className="text-muted-foreground">calls</span></span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">read</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">👁️ View</Button>
                    <Button size="sm" variant="ghost" className="text-red-600">🗑️ Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>🔔 Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-foreground/70">Fraud alerts, reports, billing</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-foreground/70">Critical fraud detection alerts</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Weekly Reports</h4>
                <p className="text-sm text-foreground/70">Performance summary emails</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Updates</h4>
                <p className="text-sm text-foreground/70">Product updates and tips</p>
              </div>
              <Badge variant="outline" className="text-gray-600 border-gray-200">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Advanced Settings</CardTitle>
          <CardDescription>Advanced configuration and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="font-medium mb-2">🔗 Google Ads Integration</h4>
              <p className="text-sm text-foreground/70 mb-3">Connected to {user?.email}</p>
              <div className="flex gap-2">
                <Badge className="bg-green-100 text-green-700 border-green-200">✅ Connected</Badge>
                <Badge variant="outline">🔄 Sync Active</Badge>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">📊 Data Retention</h4>
              <p className="text-sm text-foreground/70 mb-3">How long to keep your data</p>
              <select className="w-full p-2 border rounded-md">
                <option>30 days (Free Plan)</option>
                <option>90 days (Pro Plan)</option>
                <option>1 year (Enterprise)</option>
                <option>Forever (Enterprise)</option>
              </select>
            </div>

            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">🌐 Webhook URL</h4>
              <p className="text-sm text-foreground/70 mb-3">Receive real-time fraud alerts</p>
              <Input placeholder="https://your-app.com/webhooks/adshield" />
            </div>

            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">🎨 Dashboard Theme</h4>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">🌞 Light</Button>
                <Button size="sm" className="bg-primary">🌙 Dark</Button>
                <Button size="sm" variant="outline">🔄 Auto</Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                🗑️ Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}