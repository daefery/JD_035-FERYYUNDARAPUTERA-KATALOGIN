import { analyticsService } from "@/services/analyticsService";
import { publicAnalyticsService } from "@/services/publicAnalyticsService";

// Helper function to determine if we should use public analytics
const shouldUsePublicAnalytics = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check if we're on a public store page (not in dashboard)
  window.location.pathname.startsWith("/store/");
  window.location.pathname.startsWith("/dashboard/");

  // For now, let's always use the authenticated service to test
  // This was working before, so let's make sure the RLS policies work first
  return false; // Always use authenticated service for now
};

// Generate a unique visitor ID (stored in localStorage)
export const getVisitorId = (): string => {
  if (typeof window === "undefined") return "server";

  let visitorId = localStorage.getItem("katalogin_visitor_id");
  if (!visitorId) {
    visitorId =
      "visitor_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem("katalogin_visitor_id", visitorId);
  }
  return visitorId;
};

// Generate a session ID (new for each browser session)
export const getSessionId = (): string => {
  if (typeof window === "undefined") return "server";

  let sessionId = sessionStorage.getItem("katalogin_session_id");
  if (!sessionId) {
    sessionId =
      "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    sessionStorage.setItem("katalogin_session_id", sessionId);
  }
  return sessionId;
};

// Detect device type
export const getDeviceType = (): "mobile" | "desktop" | "tablet" => {
  if (typeof window === "undefined") return "desktop";

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);

  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "desktop";
};

// Detect browser
export const getBrowser = (): string => {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Other";
};

// Detect OS
export const getOS = (): string => {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";
  return "Other";
};

// Get IP and location (simplified - in production you'd use a service)
// export const getLocationData = async () => {
//   try {
//     const response = await fetch("https://ipapi.co/json/");
//     const data = await response.json();
//     return {
//       country: data.country_name,
//       city: data.city,
//       region: data.region,
//       latitude: data.latitude,
//       longitude: data.longitude,
//     };
//   } catch (error) {
//     console.error("Failed to get location data:", error);
//     return {
//       country: "Unknown",
//       city: "Unknown",
//       region: "Unknown",
//       latitude: null,
//       longitude: null,
//     };
//   }
// };

// Track store visit
export const trackStoreVisit = async (storeId: string) => {
  try {
    // const locationData = await getLocationData();
    const usePublic = shouldUsePublicAnalytics();
    const service = usePublic ? publicAnalyticsService : analyticsService;

    await service.trackStoreVisit({
      store_id: storeId,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      user_agent: typeof window !== "undefined" ? navigator.userAgent : "",
      referrer: typeof window !== "undefined" ? document.referrer : "",
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      // ...locationData,
      visit_date: new Date().toISOString().split("T")[0],
      visit_time: new Date().toISOString(),
      page_views: 1,
      is_bounce: true, // Will be updated to false if user interacts
    });
  } catch (error) {
    console.error("Failed to track store visit:", error);
  }
};

// Track page view
export const trackPageView = async (storeId: string, pageType: string) => {
  try {
    const usePublic = shouldUsePublicAnalytics();
    const service = usePublic ? publicAnalyticsService : analyticsService;

    await service.trackPageView({
      store_id: storeId,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_type: pageType,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      view_time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

// Track user interaction
export const trackUserInteraction = async (
  storeId: string,
  interactionType:
    | "email_click"
    | "phone_click"
    | "whatsapp_click"
    | "map_click"
    | "social_click"
    | "share_click"
    | "menu_item_click"
    | "category_click",
  interactionTarget: string,
  interactionData?: Record<string, unknown>
) => {
  try {
    const usePublic = shouldUsePublicAnalytics();
    const service = usePublic ? publicAnalyticsService : analyticsService;

    await service.trackUserInteraction({
      store_id: storeId,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      interaction_type: interactionType,
      interaction_target: interactionTarget,
      interaction_data: interactionData,
      interaction_time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track user interaction:", error);
  }
};

// Track menu item analytics
export const trackMenuItemAnalytics = async (
  storeId: string,
  menuItemId: string,
  actionType: "view" | "click" | "hover" | "share",
  timeSpent?: number
) => {
  try {
    const usePublic = shouldUsePublicAnalytics();
    const service = usePublic ? publicAnalyticsService : analyticsService;

    await service.trackMenuItemAnalytics({
      store_id: storeId,
      menu_item_id: menuItemId,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      action_type: actionType,
      action_time: new Date().toISOString(),
      time_spent: timeSpent,
    });
  } catch (error) {
    console.error("Failed to track menu item analytics:", error);
  }
};

// Update session to non-bounce (when user interacts)
export const updateSessionToNonBounce = async (storeId: string) => {
  try {
    // This would typically update the store_visits table
    // For now, we'll track it as an interaction
    await trackUserInteraction(
      storeId,
      "menu_item_click",
      "session_interaction",
      {
        action: "non_bounce_session",
      }
    );
  } catch (error) {
    console.error("Failed to update session to non-bounce:", error);
  }
};

// Test function to verify analytics system
export const testAnalyticsSystem = async (storeId: string) => {
  try {
    // Test store visit tracking

    await trackStoreVisit(storeId);

    // Test page view tracking

    await trackPageView(storeId, "test_page");

    // Test user interaction tracking

    await trackUserInteraction(storeId, "email_click", "test_contact");

    // Test menu item analytics tracking

    await trackMenuItemAnalytics(storeId, "test_item_id", "click");
  } catch (error) {
    console.error("Analytics system test failed:", error);
  }
};
