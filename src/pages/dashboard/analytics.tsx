/* eslint-disable react-hooks/exhaustive-deps */
import SimpleAnalyticsDashboard from "@/components/SimpleAnalyticsDashboard";
import { supabase } from "@/lib/supabase";
import { Store } from "@/types/database";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AnalyticsPage: React.FC = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadStores();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    }
  };

  const loadStores = async () => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStores(data || []);

      // Auto-select first store if available
      if (data && data.length > 0 && !selectedStoreId) {
        setSelectedStoreId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-slate-700 rounded w-1/3 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Store Selection Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-slate-400">
                Track your store performance and visitor insights
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Store Selector */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="store-select"
                  className="text-slate-300 text-sm font-medium"
                >
                  Select Store:
                </label>
                <select
                  id="store-select"
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a store...</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Analytics Button */}
              <Link
                href="/dashboard/stores"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {selectedStoreId ? (
        <SimpleAnalyticsDashboard storeId={selectedStoreId} />
      ) : (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Store
              </h3>
              <p className="text-slate-400 mb-6">
                Choose a store from the dropdown above to view its analytics
                data
              </p>

              {stores.length === 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="text-lg font-medium text-white mb-2">
                    No Stores Found
                  </h4>
                  <p className="text-slate-400 mb-4">
                    You don&apos;t have any stores yet. Create your first store
                    to start tracking analytics.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/stores/create")}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Create Store
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
