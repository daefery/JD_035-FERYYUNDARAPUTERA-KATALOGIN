import {
  BarChartIcon,
  EmailIcon,
  LightningIcon,
  LinkIcon,
  LocationIcon,
  MobileIcon,
  PhoneIcon,
  RocketIcon,
  TemplateIcon,
} from "@/components/icons";
import KataloginLogo from "@/components/KataloginLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Store } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Load sample stores for showcase
  useEffect(() => {
    loadSampleStores();
  }, []);

  const loadSampleStores = async () => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("is_active", true)
        .limit(6);

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error("Error loading stores:", error);
      // Fallback to sample data
      setStores([
        {
          id: "1",
          name: "Café Luna",
          description: "Artisanal coffee and pastries",
          slug: "cafe-luna",
          logo_url: null,
          banner_url: null,
          is_active: true,
          user_id: "",
          created_at: "",
          updated_at: "",
          address: "123 Coffee Street",
          phone: "+62234567890",
          email: "hello@cafeluna.com",
          facebook_url: null,
          instagram_url: null,
          twitter_url: null,
          tiktok_url: null,
          latitude: null,
          longitude: null,
        },
        {
          id: "2",
          name: "Pizza Palace",
          description: "Authentic Italian pizza",
          slug: "pizza-palace",
          logo_url: null,
          banner_url: null,
          is_active: true,
          user_id: "",
          created_at: "",
          updated_at: "",
          address: "456 Pizza Avenue",
          phone: "+62234567891",
          email: "order@pizzapalace.com",
          facebook_url: null,
          instagram_url: null,
          twitter_url: null,
          tiktok_url: null,
          latitude: null,
          longitude: null,
        },
        {
          id: "3",
          name: "Sushi Master",
          description: "Fresh sushi and Japanese cuisine",
          slug: "sushi-master",
          logo_url: null,
          banner_url: null,
          is_active: true,
          user_id: "",
          created_at: "",
          updated_at: "",
          address: "789 Sushi Lane",
          phone: "+6234567892",
          email: "info@sushimaster.com",
          facebook_url: null,
          instagram_url: null,
          twitter_url: null,
          tiktok_url: null,
          latitude: null,
          longitude: null,
        },
      ]);
    } finally {
      setIsLoadingStores(false);
    }
  };

  // Auto-rotate carousel
  useEffect(() => {
    if (stores.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoreIndex((prev) => (prev + 1) % stores.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [stores.length]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Don't render homepage if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <KataloginLogo size="md" clickable={true} />
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="hidden md:flex text-slate-300 hover:text-white transition-colors"
            >
              {t("auth.login")}
            </Link>
            <Link
              href="/register"
              className="hidden md:flex bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              {t("common.getStarted")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t("landing.heroTitle")}
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t("landing.heroSubtitle")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t("landing.heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                {t("landing.startCreatingFree")}
              </Link>
              <Link
                href="#showcase"
                className="border border-slate-600 text-slate-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                {t("landing.viewExamples")}
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            {t("landing.featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TemplateIcon className="w-8 h-8 text-purple-400" />,
                title: t("landing.beautifulTemplates"),
                description: t("landing.beautifulTemplatesDesc"),
              },
              {
                icon: <MobileIcon className="w-8 h-8 text-blue-400" />,
                title: t("landing.mobileOptimized"),
                description: t("landing.mobileOptimizedDesc"),
              },
              {
                icon: <BarChartIcon className="w-8 h-8 text-green-400" />,
                title: t("landing.analyticsDashboard"),
                description: t("landing.analyticsDashboardDesc"),
              },
              {
                icon: <RocketIcon className="w-8 h-8 text-orange-400" />,
                title: t("landing.easySetup"),
                description: t("landing.easySetupDesc"),
              },
              {
                icon: <LinkIcon className="w-8 h-8 text-pink-400" />,
                title: t("landing.socialIntegration"),
                description: t("landing.socialIntegrationDesc"),
              },
              {
                icon: <LightningIcon className="w-8 h-8 text-yellow-400" />,
                title: t("landing.lightningFast"),
                description: t("landing.lightningFastDesc"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Showcase Section */}
      <section id="showcase" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            {t("landing.showcaseTitle")}
          </h2>

          {isLoadingStores ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel */}
              <div className="overflow-hidden rounded-2xl">
                <div className="flex transition-transform duration-500 ease-in-out">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="w-full flex-shrink-0"
                      style={{
                        transform: `translateX(-${currentStoreIndex * 100}%)`,
                      }}
                    >
                      <div className="relative group">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                        {/* Main card */}
                        <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 md:p-12 overflow-hidden">
                          {/* Animated background pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
                          </div>

                          <div className="relative z-10">
                            {/* Header with logo and name */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className="relative">
                                {store.logo_url ? (
                                  <Image
                                    width={64}
                                    height={64}
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-600/50 shadow-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-slate-600/50 shadow-lg">
                                    <span className="text-white font-bold text-xl">
                                      {store.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-3xl font-bold text-white mb-1">
                                  {store.name}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium">
                                  {t("landing.liveStorePreview")}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                              {store.description}
                            </p>

                            {/* Contact info with icons */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                  <LocationIcon className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-medium">
                                    Location
                                  </p>
                                  <p className="text-white text-sm">
                                    {store.address}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                  <PhoneIcon className="w-4 h-4 text-pink-400" />
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-medium">
                                    Phone
                                  </p>
                                  <p className="text-white text-sm">
                                    {store.phone}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <EmailIcon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-medium">
                                    Email
                                  </p>
                                  <p className="text-white text-sm">
                                    {store.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Action button */}
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/store/${store.slug}`}
                                className="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <span className="relative z-10 flex items-center gap-2">
                                  {t("landing.visitStore")}
                                  <svg
                                    className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              </Link>

                              {/* Status indicator */}
                              <div className="flex items-center gap-2 text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">
                                  Live
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {stores.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoreIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentStoreIndex
                        ? "bg-purple-500"
                        : "bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("landing.ctaTitle")}
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            {t("landing.ctaDescription")}
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
          >
            {t("landing.startCreatingFree")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <KataloginLogo size="sm" clickable={true} showTagline={false} />
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("footer.support")}
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
