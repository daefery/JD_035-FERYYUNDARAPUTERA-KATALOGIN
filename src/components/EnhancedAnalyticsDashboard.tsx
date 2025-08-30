import { analyticsService } from "@/services/analyticsService";
import { AnalyticsPeriod, AnalyticsSummary } from "@/types/analytics";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnhancedAnalyticsDashboardProps {
  storeId?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  storeId,
}) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    storeId
  );

  useEffect(() => {
    if (selectedStoreId) {
      loadAnalytics();
    }
  }, [selectedStoreId, period]);

  const loadAnalytics = async () => {
    if (!selectedStoreId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getAnalyticsSummary(
        selectedStoreId,
        period
      );
      setSummary(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num > 0 ? "+" : ""}${num.toFixed(1)}%`;
  };

  const getDeviceData = () => {
    if (!summary?.deviceBreakdown) return [];

    return Object.entries(summary.deviceBreakdown).map(([device, count]) => ({
      name: device,
      value: count,
    }));
  };

  const getDailyTrendsData = () => {
    if (!summary?.dailyTrends) return [];

    return summary.dailyTrends.map((trend) => ({
      date: new Date(trend.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      visits: trend.visits,
      pageViews: trend.pageViews,
      interactions: trend.interactions,
    }));
  };

  const getTopInteractionsData = () => {
    if (!summary?.topInteractions) return [];

    return summary.topInteractions.slice(0, 10).map((interaction) => ({
      name: interaction.interactionType,
      count: interaction.count,
      percentage: interaction.percentage,
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
              Enhanced Analytics Dashboard
            </h1>
            <p className="text-slate-400">
              {summary.storeName} •{" "}
              {period === "7d"
                ? "Last 7 days"
                : period === "30d"
                ? "Last 30 days"
                : period === "90d"
                ? "Last 90 days"
                : "Last 365 days"}
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            {(["7d", "30d", "90d", "365d"] as AnalyticsPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {p}
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
                  {formatNumber(summary.totalVisits)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    summary.visitsGrowth >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercentage(summary.visitsGrowth)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Page Views</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatNumber(summary.totalPageViews)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    summary.pageViewsGrowth >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercentage(summary.pageViewsGrowth)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
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
                  {formatNumber(summary.totalInteractions)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    summary.interactionsGrowth >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercentage(summary.interactionsGrowth)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
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
                  {summary.bounceRate.toFixed(1)}%
                </p>
                <p
                  className={`text-sm mt-1 ${
                    summary.bounceRateChange <= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercentage(summary.bounceRateChange)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Trends Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Daily Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getDailyTrendsData()}>
                <defs>
                  <linearGradient
                    id="visitsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="pageViewsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#visitsGradient)"
                  name="Visits"
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#pageViewsGradient)"
                  name="Page Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Device Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getDeviceData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getDeviceData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Interactions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Top Interactions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTopInteractionsData()} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9CA3AF"
                fontSize={12}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value: number) => [value, "Interactions"]}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
