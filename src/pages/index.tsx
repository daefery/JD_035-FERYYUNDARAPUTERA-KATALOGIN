import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Store } from "@/types/database";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
          phone: "+1234567890",
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
          phone: "+1234567891",
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
          phone: "+1234567892",
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-white font-bold text-xl">Katalogin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Beautiful
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital Catalogs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Transform your restaurant, café, or retail store with stunning
              digital menus and catalogs. Easy to create, beautiful to showcase,
              powerful to manage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Creating Free
              </Link>
              <Link
                href="#showcase"
                className="border border-slate-600 text-slate-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                View Examples
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
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Beautiful Templates",
                description:
                  "Choose from professionally designed templates that make your store look amazing.",
              },
              {
                icon: "📱",
                title: "Mobile Optimized",
                description:
                  "Your digital catalog looks perfect on every device - desktop, tablet, and mobile.",
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description:
                  "Track visitor engagement, popular items, and performance with detailed analytics.",
              },
              {
                icon: "🚀",
                title: "Easy Setup",
                description:
                  "Get your store online in minutes with our guided onboarding process.",
              },
              {
                icon: "🔗",
                title: "Social Integration",
                description:
                  "Connect your social media accounts and share your store easily.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description:
                  "Built with modern technology for blazing fast loading times.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
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
            See What Others Are Creating
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
                      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-3xl font-bold text-white mb-4">
                              {store.name}
                            </h3>
                            <p className="text-slate-300 text-lg mb-6">
                              {store.description}
                            </p>
                            <div className="space-y-3 mb-8">
                              <div className="flex items-center text-slate-300">
                                <span className="mr-3">📍</span>
                                {store.address}
                              </div>
                              <div className="flex items-center text-slate-300">
                                <span className="mr-3">📞</span>
                                {store.phone}
                              </div>
                              <div className="flex items-center text-slate-300">
                                <span className="mr-3">✉️</span>
                                {store.email}
                              </div>
                            </div>
                            <Link
                              href={`/store/${store.slug}`}
                              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                              Visit Store
                            </Link>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-8 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl mb-4">🏪</div>
                              <p className="text-slate-300">
                                Live Store Preview
                              </p>
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of businesses that have already created beautiful
            digital catalogs with Katalogin.
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-white font-semibold">Katalogin</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>
              &copy; 2024 Katalogin. Built with ❤️ using Next.js, TypeScript,
              and Supabase.
            </p>
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
      `}</style>
    </div>
  );
}
