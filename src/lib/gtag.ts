export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || "AW-18420354798";
export const LEAD_CONVERSION_ID = "AW-18420354798/vf9XCMvv6ewcEO6dwc9E";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Trigger Google Ads lead conversion event
 * Event snippet for "إرسال نموذج عملاء محتملين"
 */
export const trackLeadConversion = (value: number = 1.0, currency: string = "SAR") => {
  if (typeof window !== "undefined") {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: LEAD_CONVERSION_ID,
        value: value,
        currency: currency,
      });
    } else if (window.dataLayer) {
      window.dataLayer.push({
        event: "conversion",
        send_to: LEAD_CONVERSION_ID,
        value: value,
        currency: currency,
      });
    }
  }
};
