import { GoogleAdsApi, Customer } from "google-ads-api";

export interface GoogleAdsConfig {
  client_id: string;
  client_secret: string;
  developer_token: string;
}

export interface ClickData {
  date: string;
  hour: number;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
  device: string;
  geo_target: string;
}

export interface SearchTermData {
  search_term: string;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
  match_type: string;
  keyword: string;
  ad_group: string;
  campaign: string;
}

export interface FraudAlert {
  type: "ip_fraud" | "budget_burn" | "bot_pattern" | "geo_anomaly";
  severity: "low" | "medium" | "high";
  message: string;
  data: any;
  timestamp: Date;
}

class GoogleAdsService {
  private client: GoogleAdsApi;
  private customer: Customer | null = null;

  constructor(config: GoogleAdsConfig) {
    this.client = new GoogleAdsApi({
      client_id: config.client_id,
      client_secret: config.client_secret,
      developer_token: config.developer_token,
    });
  }

  // UPDATED FUNCTION DEFINITION
  async connectToCustomer(
    customerId: string,
    refreshToken: string,
    loginCustomerId?: string // This makes the 3rd argument optional
  ): Promise<void> {
    try {
      this.customer = this.client.Customer({
        customer_id: customerId,
        login_customer_id: loginCustomerId, // It's now correctly used here
        refresh_token: refreshToken,
      });

      await this.customer.query(`
        SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1
      `);
      console.log(
        `✅ Successfully connected to Google Ads account: ${customerId}`
      );
    } catch (error) {
      console.error("❌ Failed to connect to Google Ads:", error);
      throw new Error("Could not establish connection with Google Ads.");
    }
  }

  async getClickPerformance(
    dateRange: string = "LAST_7_DAYS"
  ): Promise<ClickData[]> {
    if (!this.customer) throw new Error("Customer not connected.");
    try {
      const results = await this.customer.query(`
        SELECT 
          segments.date, segments.hour, segments.device,
          geographic_view.country_criterion_id, metrics.clicks, 
          metrics.impressions, metrics.cost_micros, metrics.conversions
        FROM geographic_view
        WHERE segments.date DURING ${dateRange}
      `);
      return results.map((row: any) => ({
        date: row.segments.date,
        hour: row.segments.hour || 0,
        clicks: row.metrics.clicks || 0,
        impressions: row.metrics.impressions || 0,
        cost: (row.metrics.cost_micros || 0) / 1000000,
        conversions: row.metrics.conversions || 0,
        device: row.segments.device || "UNKNOWN",
        geo_target: row.geographic_view.country_criterion_id || "UNKNOWN",
      }));
    } catch (error) {
      console.error("❌ Failed to fetch click performance data:", error);
      throw error;
    }
  }

  async getBudgetData(): Promise<any[]> {
    if (!this.customer) throw new Error("Customer not connected.");
    try {
      const results = await this.customer.query(`
            SELECT 
                campaign.name, campaign_budget.amount_micros,
                metrics.cost_micros, metrics.clicks, metrics.impressions,
                segments.date
            FROM campaign
            WHERE segments.date = TODAY AND campaign.status = 'ENABLED'
        `);
      return results.map((row: any) => ({
        campaign_name: row.campaign.name,
        daily_budget: (row.campaign_budget.amount_micros || 0) / 1000000,
        current_spend: (row.metrics.cost_micros || 0) / 1000000,
        clicks: row.metrics.clicks || 0,
        impressions: row.metrics.impressions || 0,
        burn_rate:
          ((row.metrics.cost_micros || 0) /
            (row.campaign_budget.amount_micros || 1)) *
          100,
        date: row.segments.date,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch budget data:", error);
      throw error;
    }
  }

  analyzeClickFraud(clickData: ClickData[]): FraudAlert[] {
    const alerts: FraudAlert[] = [];
    const clicksByHour = new Map<string, number>();
    for (const data of clickData) {
      const hourKey = `${data.date}-${data.hour}`;
      clicksByHour.set(hourKey, (clicksByHour.get(hourKey) || 0) + data.clicks);
    }
    const averageHourlyClicks =
      Array.from(clicksByHour.values()).reduce((a, b) => a + b, 0) /
      clicksByHour.size;
    for (const [hour, clicks] of clicksByHour) {
      if (clicks > averageHourlyClicks * 3) {
        alerts.push({
          type: "bot_pattern",
          severity: "high",
          message: `Unusual click spike: ${clicks} clicks at ${hour}`,
          data: { hour, clicks, average: averageHourlyClicks },
          timestamp: new Date(),
        });
      }
    }
    return alerts;
  }
}

export default GoogleAdsService;
