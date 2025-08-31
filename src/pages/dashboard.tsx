import DashboardHeader from "@/components/DashboardHeader";
import DashboardWelcome from "@/components/DashboardWelcome";
import {
  BarChartIcon,
  CheckCircleIcon,
  EyeIcon,
  LightBulbIcon,
  LightningIcon,
  PlusIcon,
  StoreIcon,
  TemplateIcon,
  TrendingUpIcon,
  UtensilsIcon,
  WaveIcon,
} from "@/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { Geist } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const geist = Geist({
  subsets: ["latin"],
});

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [storeCount, setStoreCount] = useState(0);
  const [activeStoreCount, setActiveStoreCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(0);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load all dashboard data in parallel
      const [count, activeCount, views, menuItems] = await Promise.all([
        userService.getStoreCount(user!.id),
        userService.getActiveStoreCount(user!.id),
        userService.getTotalViews(user!.id),
        userService.getTotalMenuItems(user!.id),
      ]);

      setStoreCount(count);
      setActiveStoreCount(activeCount);
      setTotalViews(views);
      setTotalMenuItems(menuItems);

      // Load recent stores (you can implement this in userService)
      // const stores = await userService.getRecentStores(user!.id, 3);
      // setRecentStores(stores);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`${geist.className} min-h-screen relative overflow-hidden`}>
      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <DashboardHeader />

        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                Welcome back, {user.user_metadata?.firstName || "User"}!
                <WaveIcon className="w-8 h-8 text-purple-300" />
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your digital catalogs and track your business growth
              </p>
            </div>

            {/* Welcome Component */}
            {!isLoadingStores && <DashboardWelcome storeCount={storeCount} />}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Stores</p>
                    <p className="text-3xl font-bold text-white">
                      {storeCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <StoreIcon className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Views</p>
                    <p className="text-3xl font-bold text-white">
                      {totalViews}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <EyeIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Menu Items</p>
                    <p className="text-3xl font-bold text-white">
                      {totalMenuItems}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <UtensilsIcon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Active Stores</p>
                    <p className="text-3xl font-bold text-white">
                      {activeStoreCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <LightningIcon className="w-6 h-6 text-yellow-400" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/dashboard/stores/create"
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <PlusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Create New Store
                          </h3>
                          <p className="text-purple-100 text-sm">
                            Start building your digital catalog
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/stores"
                      className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <StoreIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Manage Stores
                          </h3>
                          <p className="text-blue-100 text-sm">
                            Edit and organize your catalogs
                          </p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/analytics"
                      className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <BarChartIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            View Analytics
                          </h3>
                          <p className="text-green-100 text-sm">
                            Track performance and insights
                          </p>
                        </div>
                      </div>
                    </Link>

                    <div className="group bg-gradient-to-r from-slate-600 to-gray-600 text-white p-6 rounded-xl transition-all duration-300 relative overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <TemplateIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Browse Templates
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Choose from beautiful designs
                          </p>
                        </div>
                      </div>
                      {/* Coming Soon Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          Coming Soon
                        </span>
                      </div>
                      {/* Overlay for disabled state */}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Feature Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Quick Info */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          Successfully signed in
                        </p>
                        <p className="text-gray-400 text-xs">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          Account created
                        </p>
                        <p className="text-gray-400 text-xs">Today</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          Welcome to Katalogin!
                        </p>
                        <p className="text-gray-400 text-xs">Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-yellow-400" />
                    Quick Tips
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <p className="text-gray-300">
                        Add high-quality images to make your catalog stand out
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <p className="text-gray-300">
                        Use descriptive categories to organize your menu items
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-300">•</span>
                      <p className="text-gray-300">
                        Share your catalog link on social media to reach more
                        customers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
