/* eslint-disable @typescript-eslint/no-explicit-any */
import BackToTop from "@/components/BackToTop";
import {
  EmailIcon,
  FacebookIcon,
  ImageIcon,
  InstagramIcon,
  LocationIcon,
  PhoneIcon,
  PlusIcon,
  TikTokIcon,
  TwitterIcon,
} from "@/components/icons";
import TemplateHeader from "@/components/TemplateHeader";
import { Category, MenuItem, Store } from "@/types/database";
import {
  trackMenuItemAnalytics,
  trackPageView,
  trackStoreVisit,
  trackUserInteraction,
  updateSessionToNonBounce,
} from "@/utils/analytics";
import Image from "next/image";
import React, { useEffect } from "react";

interface ModernRestaurantTemplateProps {
  store?: Store;
  categories?: Category[];
  menuItems?: MenuItem[];
}

const ModernRestaurantTemplate: React.FC<ModernRestaurantTemplateProps> = ({
  store,
  categories,
  menuItems,
}) => {
  // Analytics tracking
  useEffect(() => {
    const _store = store || defaultStore;
    if (_store?.id) {
      trackStoreVisit(_store.id);
      // Also track page view
      trackPageView(_store.id, "store_main");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  // Track user interactions
  const handleContactClick = (type: "email" | "phone" | "whatsapp" | "map") => {
    const _store = store || defaultStore;
    if (_store?.id) {
      updateSessionToNonBounce(_store.id);
      trackUserInteraction(
        _store.id,
        `${type}_click` as any,
        `${type}_contact`
      );
    }
  };

  const handleSocialClick = (platform: string) => {
    const _store = store || defaultStore;
    if (_store?.id) {
      updateSessionToNonBounce(_store.id);
      trackUserInteraction(_store.id, "social_click", platform);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    const _store = store || defaultStore;
    if (_store?.id) {
      updateSessionToNonBounce(_store.id);
      trackMenuItemAnalytics(_store.id, item.id, "click");
    }
  };

  const handleMenuItemView = (item: MenuItem) => {
    const _store = store || defaultStore;
    if (_store?.id) {
      trackMenuItemAnalytics(_store.id, item.id, "view");
    }
  };
  // ---------- Dummy Data (used when props are not provided) ----------
  const defaultStore = {
    id: "store_demo",
    name: "Larana Ramen",
    description: "Authentic ramen & cozy vibes. Slurp-worthy bowls made fresh.",
    logo_url:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=256&auto=format&fit=crop",
    email: "larana@ramen.com",
    phone: "0335-0965617",
    address: "123 Anywhere St, Any City",
  } as unknown as Store;

  const defaultCategories = [
    { id: "cat_ramen", name: "Ramen", description: "" },
    { id: "cat_bev", name: "Beverage", description: "" },
  ] as unknown as Category[];

  const defaultMenuItems = [
    // Ramen
    {
      id: "item_shio",
      category_id: "cat_ramen",
      name: "Shio Ramen",
      description: "the taste of a light sea-based broth",
      price: 28000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg",
    },
    {
      id: "item_shoyu",
      category_id: "cat_ramen",
      name: "Shoyu Ramen",
      description: "chicken broth with spices and soy sauce",
      price: 30000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg",
    },
    {
      id: "item_miso",
      category_id: "cat_ramen",
      name: "Miso Ramen",
      description: "miso paste lends a savory flavor to the ramen broth",
      price: 25000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg",
    },
    {
      id: "item_tonkotsu",
      category_id: "cat_ramen",
      name: "Tonkotsu Ramen",
      description: "this ramen is white in color with a thick texture",
      price: 32000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/2297961/pexels-photo-2297961.jpeg",
    },
    {
      id: "item_kobe",
      category_id: "cat_ramen",
      name: "Ramen Kobe",
      description: "slices of beef stuffed with pickled radish and chives",
      price: 28000,
      is_available: true,
      image_url:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "item_hakodate",
      category_id: "cat_ramen",
      name: "Hakodate Ramen",
      description: "using cheese powder as a flavoring for the ramen",
      price: 27000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg",
    },
    // Beverage
    {
      id: "bev_lemontea",
      category_id: "cat_bev",
      name: "Lemon Tea",
      description: "iced tea with lemon",
      price: 12000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/27851491/pexels-photo-27851491.jpeg",
    },
    {
      id: "bev_orange",
      category_id: "cat_bev",
      name: "Orange Juice",
      description: "fresh and delicious orange juice",
      price: 15000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/15823325/pexels-photo-15823325.jpeg",
    },
    {
      id: "bev_squash",
      category_id: "cat_bev",
      name: "Lemon Squash",
      description: "fresh lemon squash",
      price: 14000,
      is_available: true,
      image_url:
        "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "bev_choco",
      category_id: "cat_bev",
      name: "Chocolate",
      description: "iced chocolate with cream",
      price: 15000,
      is_available: true,
      image_url:
        "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg",
    },
  ] as unknown as MenuItem[];

  const _store = store ?? defaultStore;
  const _categories = (
    categories && categories.length ? categories : defaultCategories
  ) as Category[];
  const _menuItems = (
    menuItems && menuItems.length ? menuItems : defaultMenuItems
  ) as MenuItem[];

  // Group menu items by category
  const menuByCategory = _categories.map((category) => ({
    ...category,
    items: _menuItems.filter(
      (item) => item.category_id === (category as any).id
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Texture (chalkboard-ish) */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/bg1.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Admin Header for Logged Users */}
        <TemplateHeader storeSlug={_store.slug || ""} storeName={_store.name} />

        {/* Store Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              {/* Store Logo */}
              {(_store as any).logo_url && (
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden bg-white shadow-lg">
                  <Image
                    src={(_store as any).logo_url}
                    alt={_store.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {/* Store Name */}
              <div className="text-white">
                <h1 className="text-lg md:text-4xl font-bold mb-0">
                  {_store.name}
                </h1>
                {/* {(_store as any).description && (
                  <p className="text-gray-300 text-xs max-w-md">
                    {(_store as any).description}
                  </p>
                )} */}
              </div>
            </div>

            {/* Social Media Links */}
            {((_store as any).facebook_url ||
              (_store as any).instagram_url ||
              (_store as any).twitter_url ||
              (_store as any).tiktok_url) && (
              <div className="flex items-center gap-3">
                {/* Instagram */}
                {(_store as any).instagram_url && (
                  <a
                    href={(_store as any).instagram_url}
                    onClick={() => handleSocialClick("instagram")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Follow us on Instagram"
                  >
                    <InstagramIcon className="w-5 h-5 text-white hover:text-pink-400 transition-colors" />
                  </a>
                )}

                {/* Facebook */}
                {(_store as any).facebook_url && (
                  <a
                    href={(_store as any).facebook_url}
                    onClick={() => handleSocialClick("facebook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Follow us on Facebook"
                  >
                    <FacebookIcon className="w-5 h-5 text-white hover:text-blue-500 transition-colors" />
                  </a>
                )}

                {/* Twitter/X */}
                {(_store as any).twitter_url && (
                  <a
                    href={(_store as any).twitter_url}
                    onClick={() => handleSocialClick("twitter")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Follow us on Twitter/X"
                  >
                    <TwitterIcon className="w-5 h-5 text-white hover:text-blue-400 transition-colors" />
                  </a>
                )}

                {/* TikTok */}
                {(_store as any).tiktok_url && (
                  <a
                    href={(_store as any).tiktok_url}
                    onClick={() => handleSocialClick("tiktok")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Follow us on TikTok"
                  >
                    <TikTokIcon className="w-5 h-5 text-white hover:text-pink-500 transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Featured Banner Section */}
          {(_store as any).banner_url && (
            <div className="mb-16">
              <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={(_store as any).banner_url}
                  alt={`${_store.name} banner`}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Optional overlay with store info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      Welcome to {_store.name}
                    </h2>
                    {(_store as any).description && (
                      <p className="text-white/90 text-sm md:text-base max-w-2xl">
                        {(_store as any).description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured Items Section */}
          {_menuItems.filter((item: any) => item.is_featured).length > 0 && (
            <div className="mb-16">
              {/* Fancy Card Container */}
              <div className="relative bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 bg-pink-400/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-20 right-10 w-12 h-12 bg-indigo-400/10 rounded-full blur-xl"></div>
                </div>

                {/* Section Header */}
                <div className="relative text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Featured Items
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Our most popular and highly recommended dishes that
                    customers love
                  </p>
                </div>

                {/* Featured Items Grid */}
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {_menuItems
                      .filter((item: any) => item.is_featured)
                      .slice(0, 3) // Limit to maximum 3 items
                      .map((item: any, index: number) => (
                        <div
                          key={item.id}
                          className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 group"
                        >
                          {/* Position Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                              #{index + 1}
                            </span>
                          </div>

                          {/* Featured Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                              ⭐ Featured
                            </span>
                          </div>

                          {/* Item Image */}
                          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-500" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Item Content */}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                                {item.name}
                              </h3>
                              <span className="text-yellow-400 font-bold text-lg">
                                Rp {Number(item.price).toLocaleString("id-ID")}
                              </span>
                            </div>

                            {item.description && (
                              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}

                            {/* Category Badge */}
                            <div className="flex justify-between items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {_categories.find(
                                  (cat: any) => cat.id === item.category_id
                                )?.name || "Uncategorized"}
                              </span>

                              {/* Availability Badge */}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.is_available
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                                }`}
                              >
                                {item.is_available
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Empty State */}
                  {_menuItems.filter((item: any) => item.is_featured).length ===
                    0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlusIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-lg">
                        No featured items yet
                      </p>
                      <p className="text-gray-500 text-sm">
                        Mark items as featured to showcase them here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Menu Sections */}
          <div className="space-y-16">
            {menuByCategory.map((category: any) => (
              <div key={category.id} className="space-y-8">
                {/* Category Header */}
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {category.name}
                  </h2>
                  {/* {category.description && (
                    <p className="text-gray-300 text-lg">
                      {category.description}
                    </p>
                  )} */}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-[28px] shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleMenuItemClick(item)}
                      onMouseEnter={() => handleMenuItemView(item)}
                    >
                      {/* Item Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Item Content */}
                      <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {/* Availability Badge */}
                        <div className="mt-4 mb-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="bg-amber-700/90 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-20 pt-12 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-start">
            {/* Email */}
            {(_store as any).email && (
              <a
                href={`mailto:${(_store as any).email}`}
                onClick={() => handleContactClick("email")}
                className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <EmailIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                    {(_store as any).email}
                  </p>
                </div>
              </a>
            )}

            {/* Phone */}
            {(_store as any).phone && (
              <a
                href={`https://wa.me/${(_store as any).phone.replace(
                  /\D/g,
                  ""
                )}?text=Hi, I'm interested in your menu!`}
                onClick={() => handleContactClick("whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <PhoneIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                    {(_store as any).phone}
                  </p>
                </div>
              </a>
            )}

            {/* Address */}
            {(_store as any).address && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  (_store as any).address
                )}`}
                onClick={() => handleContactClick("map")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <LocationIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                    {(_store as any).address}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </div>
  );
};

export default ModernRestaurantTemplate;
