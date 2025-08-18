// Configuration for Google Ads API and other services
export const config = {
  googleAds: {
    developerToken:
      process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "P-nUh8UaSdvcWW9P3nb_6g",
    clientId:
      process.env.GOOGLE_CLIENT_ID ||
      "593391427238-4ltgu1s1ed5kojlqev3bbv8jbgm9hm0d.apps.googleusercontent.com",
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET || "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",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  alerts: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || "",
      fromEmail: process.env.SENDGRID_FROM_EMAIL || "alerts@adshield.com",
    },
  },
};

// Client-side configuration (only public env vars)
export const clientConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
};
