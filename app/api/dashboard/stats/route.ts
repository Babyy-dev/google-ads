import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: fraudAlerts, error: alertsError } = await supabase
      .from("fraud_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (alertsError) {
      console.error("Error fetching fraud alerts:", alertsError);
    }

    // In a real application, you would also fetch performance snapshots here
    // For now, we'll focus on displaying the fraud alerts

    const totalBlockedIPs =
      fraudAlerts?.filter((alert: any) => alert.alert_type === "ip_fraud")
        .length || 0;

    return NextResponse.json({
      success: true,
      stats: {
        savedBudget: "$0", // Placeholder
        blockedIPs: totalBlockedIPs.toString(),
        keywordsBlocked: "0", // Placeholder
        detectionRate: "0%", // Placeholder
      },
      charts: {
        fraudVsValid: [], // Placeholder
        budgetSavings: [], // Placeholder
      },
      recentAlerts:
        fraudAlerts?.map((alert: any) => ({
          ip: alert.data?.ip_address || "N/A",
          location: alert.data?.location || "Unknown",
          type: alert.alert_type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          cost: alert.data?.cost || "$0.00",
          clicks: alert.data?.clicks || 0,
          risk:
            alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1),
          status: alert.is_resolved ? "Resolved" : "Blocked",
        })) || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard statistics",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
