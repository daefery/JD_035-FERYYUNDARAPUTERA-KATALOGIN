import { analyticsService } from "@/services/analyticsService";
import { AnalyticsPeriod, AnalyticsSummary } from "@/types/analytics";
import React, { useEffect, useState } from "react";
import SimpleAnalyticsChart from "./SimpleAnalyticsChart";
import { BarChartIcon, EyeIcon, ThumbsUpIcon, TrendingUpIcon } from "./icons";

interface SimpleAnalyticsDashboardProps {
  storeId?: string;
}

const SimpleAnalyticsDashboard: React.FC<SimpleAnalyticsDashboardProps> = ({
  storeId,
}) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("last_7_days");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    storeId
  );

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoreId, period]);

  const loadAnalytics = async () => {
    if (!selectedStoreId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getAnalyticsSummary(selectedStoreId, {
        period,
      });
      setSummary(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getDeviceData = () => {
    if (
      !summary?.device_breakdown ||
      Object.keys(summary.device_breakdown).length === 0
    ) {
      return [];
    }

    return Object.entries(summary.device_breakdown).map(([device, count]) => ({
      name: device,
      value: count,
    }));
  };

  const getDailyTrendsData = () => {
    if (!summary?.daily_trends || summary.daily_trends.length === 0) {
      return [];
    }

    return summary.daily_trends.map((trend) => ({
      name: new Date(trend.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: trend.visits,
    }));
  };

  const getTopInteractionsData = () => {
    if (!summary?.top_interactions || summary.top_interactions.length === 0) {
      return [];
    }

    return summary.top_interactions.slice(0, 8).map((interaction) => ({
      name: interaction.type,
      value: interaction.count,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
            <h3 className="text-red-400 text-lg font-semibold mb-2">
              Error Loading Analytics
            </h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={loadAnalytics}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-slate-400">
            <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
            <p>Select a store to view analytics data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400">
              Store Analytics •{" "}
              {period === "last_7_days"
                ? "Last 7 days"
                : period === "last_30_days"
                ? "Last 30 days"
                : period === "last_90_days"
                ? "Last 90 days"
                : "Last 365 days"}
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            {(
              [
                "last_7_days",
                "last_30_days",
                "last_90_days",
              ] as AnalyticsPeriod[]
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {p === "last_7_days"
                  ? "7d"
                  : p === "last_30_days"
                  ? "30d"
                  : "90d"}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Total Visits
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatNumber(summary.total_visits)}
                </p>
                <p className="text-sm mt-1 text-slate-400">Unique visitors</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Page Views</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatNumber(summary.total_page_views)}
                </p>
                <p className="text-sm mt-1 text-slate-400">Total views</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChartIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Interactions
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatNumber(summary.total_interactions)}
                </p>
                <p className="text-sm mt-1 text-slate-400">User engagement</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ThumbsUpIcon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Bounce Rate
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {summary.bounce_rate.toFixed(1)}%
                </p>
                <p className="text-sm mt-1 text-slate-400">
                  Single page visits
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Trends Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Daily Trends
            </h3>
            {getDailyTrendsData().length > 0 ? (
              <SimpleAnalyticsChart
                title="Daily Trends"
                data={getDailyTrendsData()}
                type="line"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  No daily trends data available
                </p>
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Device Breakdown
            </h3>
            {getDeviceData().length > 0 ? (
              <SimpleAnalyticsChart
                title="Device Breakdown"
                data={getDeviceData()}
                type="pie"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  No device data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Interactions */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Interactions
            </h3>
            {getTopInteractionsData().length > 0 ? (
              <SimpleAnalyticsChart
                title="Top Interactions"
                data={getTopInteractionsData()}
                type="bar"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  No interaction data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Performance */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Menu Items
            </h3>
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-2">
                Menu item analytics coming soon
              </p>
              <p className="text-slate-500 text-xs">
                This feature will track which menu items are most viewed and
                clicked
              </p>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Peak Hours
            </h4>
            <div className="space-y-2">
              {summary.peak_hours && summary.peak_hours.length > 0 ? (
                summary.peak_hours.slice(0, 5).map((hour) => (
                  <div
                    key={hour.hour}
                    className="flex justify-between items-center"
                  >
                    <span className="text-slate-300">{hour.hour}:00</span>
                    <span className="text-white font-medium">
                      {hour.visits}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No peak hours data available
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Top Countries
            </h4>
            <div className="space-y-2">
              {summary.top_countries && summary.top_countries.length > 0 ? (
                summary.top_countries.slice(0, 5).map((country) => (
                  <div
                    key={country.country}
                    className="flex justify-between items-center"
                  >
                    <span className="text-slate-300 truncate">
                      {country.country}
                    </span>
                    <span className="text-white font-medium">
                      {country.visits}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No country data available
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Engagement Metrics
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Avg. Session Duration</span>
                <span className="text-white font-medium">
                  {summary.avg_session_duration || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Unique Visitors</span>
                <span className="text-white font-medium">
                  {summary.unique_visitors || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Bounce Rate</span>
                <span className="text-white font-medium">
                  {summary.bounce_rate?.toFixed(1) || "N/A"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAnalyticsDashboard;
