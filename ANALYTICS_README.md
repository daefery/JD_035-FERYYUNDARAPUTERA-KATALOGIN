# 📊 Analytics System Implementation

## Overview

The analytics system provides comprehensive tracking and insights for store performance, user behavior, and business intelligence. It automatically collects data when visitors interact with your stores and provides detailed analytics dashboards.

## 🗄️ Database Schema

The analytics system uses 5 main tables:

### 1. `store_visits`

- **Purpose**: Track each visit to a store
- **Key Data**: Visitor ID, session ID, device info, location, UTM parameters
- **Metrics**: Session duration, page views, bounce rate

### 2. `page_views`

- **Purpose**: Track individual page views within a session
- **Key Data**: Page type, time on page, scroll depth
- **Metrics**: Page engagement, navigation patterns

### 3. `user_interactions`

- **Purpose**: Track user actions and engagement
- **Key Data**: Contact clicks, social media clicks, menu interactions
- **Metrics**: Engagement rates, popular actions

### 4. `menu_item_analytics`

- **Purpose**: Track menu item performance
- **Key Data**: Views, clicks, hover time, shares
- **Metrics**: Item popularity, engagement rates

### 5. `daily_analytics`

- **Purpose**: Aggregated daily summaries for performance
- **Key Data**: Daily totals, device breakdown, geographic data
- **Metrics**: Trends, patterns, optimization insights

## 🚀 Features

### Automatic Tracking

- ✅ **Store Visits**: Every store page load is tracked
- ✅ **Contact Actions**: Email, phone, WhatsApp, map clicks
- ✅ **Social Media**: Facebook, Instagram, Twitter, TikTok clicks
- ✅ **Menu Interactions**: Item views, clicks, hover time
- ✅ **Device Detection**: Mobile, desktop, tablet usage
- ✅ **Geographic Data**: Country, city, region tracking
- ✅ **Session Management**: Unique visitors and sessions

### Analytics Dashboard

- ✅ **Key Metrics**: Total visits, unique visitors, session duration, bounce rate
- ✅ **Device Breakdown**: Mobile vs desktop vs tablet usage
- ✅ **Top Interactions**: Most popular user actions
- ✅ **Menu Performance**: Best performing menu items
- ✅ **Category Performance**: Category engagement rates
- ✅ **Time Periods**: Today, last 7 days, last 30 days, etc.
- ✅ **Real-time Data**: Current visitors and recent activity

### Business Intelligence

- ✅ **Geographic Insights**: Where your customers are located
- ✅ **Peak Hours**: When your store gets most traffic
- ✅ **Engagement Patterns**: How users interact with your content
- ✅ **Performance Trends**: Growth and optimization opportunities

## 📁 File Structure

```
src/
├── components/
│   └── AnalyticsDashboard.tsx          # Main analytics dashboard component
├── services/
│   └── analyticsService.ts             # Analytics API service
├── types/
│   └── analytics.ts                    # TypeScript interfaces
├── utils/
│   └── analytics.ts                    # Tracking utilities
├── pages/
│   └── dashboard/
│       └── analytics.tsx               # Analytics page
└── templates/
    └── ModernRestaurantTemplate.tsx    # Template with tracking
```

## 🔧 Implementation Details

### 1. Tracking Utilities (`src/utils/analytics.ts`)

```typescript
// Track store visit
await trackStoreVisit(storeId);

// Track user interaction
await trackUserInteraction(storeId, "email_click", "contact_email");

// Track menu item analytics
await trackMenuItemAnalytics(storeId, itemId, "click");
```

### 2. Analytics Service (`src/services/analyticsService.ts`)

```typescript
// Get analytics summary
const summary = await analyticsService.getAnalyticsSummary(storeId, {
  period: "last_30_days",
});

// Get menu item performance
const performance = await analyticsService.getMenuItemPerformance(storeId, {
  period: "last_7_days",
});
```

### 3. Analytics Dashboard (`src/components/AnalyticsDashboard.tsx`)

```typescript
<AnalyticsDashboard storeId={store.id} />
```

## 🎯 Key Metrics Tracked

### Store Performance

- **Total Visits**: Overall store traffic
- **Unique Visitors**: Distinct user count
- **Page Views**: Total page views per session
- **Session Duration**: Average time spent on store
- **Bounce Rate**: Single-page visit percentage

### User Engagement

- **Contact Actions**: Email, phone, WhatsApp, map clicks
- **Social Media**: Facebook, Instagram, Twitter, TikTok interactions
- **Menu Interactions**: Item views, clicks, hover time
- **Share Actions**: Store sharing and social sharing

### Business Intelligence

- **Device Usage**: Mobile, desktop, tablet distribution
- **Geographic Data**: Country, city, region breakdown
- **Peak Hours**: Traffic patterns throughout the day
- **Popular Content**: Most viewed items and categories

## 📊 Analytics Dashboard

### Access Analytics

1. Go to your dashboard: `/dashboard/stores`
2. Click "View Analytics" button
3. Select a store to view its analytics
4. Choose time period (today, last 7 days, last 30 days, etc.)

### Dashboard Sections

1. **Key Metrics Cards**: Total visits, unique visitors, session duration, bounce rate
2. **Device Breakdown**: Mobile, desktop, tablet usage visualization
3. **Top Interactions**: Most popular user actions
4. **Menu Performance**: Best performing menu items with engagement rates
5. **Category Performance**: Category-level analytics
6. **Daily Trends**: Traffic and interaction trends over time

## 🔒 Privacy & Security

### Data Protection

- ✅ **Anonymous Tracking**: No personal information collected
- ✅ **Session-based**: Temporary session IDs, not persistent user tracking
- ✅ **Store Owner Access**: Only store owners can view their analytics
- ✅ **Row Level Security**: Database-level access control

### GDPR Compliance

- ✅ **Anonymous Data**: No personally identifiable information
- ✅ **Consent-based**: Analytics are essential for service functionality
- ✅ **Data Retention**: Analytics data retained for business insights
- ✅ **Access Control**: Store owners control their own data

## 🚀 Getting Started

### 1. Database Setup

```sql
-- Run the analytics schema
\i database/analytics_schema.sql
```

### 2. Automatic Tracking

Analytics tracking is automatically enabled for:

- Store page visits
- Contact button clicks
- Social media interactions
- Menu item interactions

### 3. View Analytics

1. Navigate to `/dashboard/analytics`
2. Select a store from the dropdown
3. View comprehensive analytics dashboard
4. Filter by time period as needed

## 📈 Business Benefits

### Customer Insights

- Understand customer behavior patterns
- Identify most popular menu items
- Track engagement with contact methods
- Monitor geographic reach

### Performance Optimization

- Optimize store layout based on user behavior
- Focus on high-performing menu items
- Improve contact method effectiveness
- Target marketing efforts geographically

### Growth Opportunities

- Identify peak business hours
- Understand device preferences
- Track social media effectiveness
- Monitor store performance trends

## 🔧 Customization

### Adding New Tracking

```typescript
// Track custom events
await trackUserInteraction(storeId, "custom_action", "action_target", {
  customData: "value",
});
```

### Custom Analytics

```typescript
// Get custom analytics data
const customData = await analyticsService.getCustomAnalytics(storeId, {
  customFilters: "value",
});
```

## 🐛 Troubleshooting

### Common Issues

1. **No Analytics Data**: Ensure store is active and has visitors
2. **Missing Tracking**: Check browser console for tracking errors
3. **Permission Errors**: Verify user has access to store analytics
4. **Database Errors**: Check analytics tables exist and have proper permissions

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem("analytics_debug", "true");
```

## 📞 Support

For analytics system support:

1. Check browser console for error messages
2. Verify database tables are properly created
3. Ensure store is active and accessible
4. Contact support with specific error details

---

**Analytics System Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: Next.js 13+, Supabase, TypeScript
