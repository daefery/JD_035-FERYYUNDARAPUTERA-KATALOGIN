import DashboardHeader from "@/components/DashboardHeader";
import {
  BarChartIcon,
  BuildingIcon,
  CheckIcon,
  CopyIcon,
  DotsVerticalIcon,
  EditIcon,
  EmailIcon,
  LocationIcon,
  MenuIcon,
  PhoneIcon,
  PlusIcon,
  TemplateIcon,
  TrashIcon,
} from "@/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import { storeService } from "@/services/storeService";
import { Store } from "@/types/database";
import { Geist } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const geist = Geist({
  subsets: ["latin"],
});

export default function StoresPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dropdownDirection, setDropdownDirection] = useState<"down" | "up">(
    "down"
  );
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load stores
  useEffect(() => {
    if (user) {
      loadStores();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking on dropdown content
      if (
        target.closest(".dropdown-menu") ||
        target.closest(".dropdown-button")
      ) {
        return;
      }
      setOpenDropdown(null);
      setDropdownPosition(null);
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const storesData = await storeService.getStores();
      setStores(storesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStore = () => {
    router.push("/dashboard/stores/create");
  };

  const handleEditStore = (storeId: string) => {
    router.push(`/dashboard/stores/${storeId}/edit`);
  };

  const handleViewStore = (storeSlug: string) => {
    router.push(`/store/${storeSlug}`);
  };

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${storeName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await storeService.deleteStore(storeId);
      setStores(stores.filter((store) => store.id !== storeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete store");
    }
  };

  const handleChooseTemplate = (storeId: string) => {
    router.push(`/dashboard/stores/${storeId}/template`);
  };

  const handleManageMenu = (storeId: string) => {
    router.push(`/dashboard/stores/${storeId}/menu`);
  };

  const toggleDropdown = (storeId: string, event?: React.MouseEvent) => {
    if (openDropdown === storeId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      setOpenDropdown(storeId);
      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const dropdownHeight = 200; // Approximate height of dropdown
        const dropdownWidth = 192; // w-48 = 192px
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // Calculate available space
        const spaceBelow = windowHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = windowWidth - rect.right;

        let x = rect.right - dropdownWidth;
        let y = rect.bottom + 4; // Default: below button

        // If not enough space below, position above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          y = rect.top - dropdownHeight - 4;
          setDropdownDirection("up");
        } else {
          setDropdownDirection("down");
        }

        // If not enough space on the right, adjust horizontally
        if (spaceRight < dropdownWidth) {
          x = rect.left - dropdownWidth;
        }

        // Ensure dropdown doesn't go off-screen
        x = Math.max(8, Math.min(x, windowWidth - dropdownWidth - 8));
        y = Math.max(8, Math.min(y, windowHeight - dropdownHeight - 8));

        setDropdownPosition({ x, y });
      }
    }
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
    setDropdownPosition(null);
    setDropdownDirection("down");
  };

  const copyStoreUrl = async (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    try {
      // Try using the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopiedSlug(slug);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
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
        <DashboardHeader />

        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Stores</h1>
              <p className="text-gray-300">
                Manage your restaurant and store catalogs
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={handleCreateStore}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Create New Store
              </button>

              <button
                onClick={() => router.push("/dashboard/analytics")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <BarChartIcon className="w-5 h-5" />
                View Analytics
              </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                {/* Stores Grid */}
                {stores.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-white/20 text-center">
                    <div className="text-gray-300 mb-4">
                      <BuildingIcon className="w-16 h-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No stores yet
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Create your first store to start building your food
                      catalog
                    </p>
                    <button
                      onClick={handleCreateStore}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    >
                      Create Your First Store
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                      <div
                        key={store.id}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20"
                      >
                        {/* Store Logo */}
                        <div className="flex items-center mb-4">
                          {store.logo_url ? (
                            <Image
                              src={store.logo_url}
                              alt={store.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-lg">
                                {store.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {store.name}
                            </h3>
                            <button
                              onClick={() => copyStoreUrl(store.slug)}
                              className={`flex items-center gap-1 text-sm transition-colors group ${
                                copiedSlug === store.slug
                                  ? "text-green-400"
                                  : "text-gray-300 hover:text-white"
                              }`}
                              title={`Copy store URL: ${window.location.origin}/store/${store.slug}`}
                            >
                              <span>/{store.slug}</span>
                              {copiedSlug === store.slug ? (
                                <CheckIcon className="w-3 h-3" />
                              ) : (
                                <CopyIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Store Description */}
                        {store.description && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {store.description}
                          </p>
                        )}

                        {/* Store Status */}
                        <div className="flex items-center mb-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              store.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {store.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* Store Info */}
                        <div className="space-y-2 mb-6">
                          {store.address && (
                            <div className="flex items-center text-sm text-gray-300">
                              <LocationIcon className="w-4 h-4 mr-2" />
                              {store.address}
                            </div>
                          )}
                          {store.phone && (
                            <div className="flex items-center text-sm text-gray-300">
                              <PhoneIcon className="w-4 h-4 mr-2" />
                              {store.phone}
                            </div>
                          )}
                          {store.email && (
                            <div className="flex items-center text-sm text-gray-300">
                              <EmailIcon className="w-4 h-4 mr-2" />
                              {store.email}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => handleViewStore(store.slug)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Store
                          </button>

                          {/* Dropdown Menu */}
                          <div className="relative dropdown-container z-10">
                            <button
                              onClick={(event) =>
                                toggleDropdown(store.id, event)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors dropdown-button"
                              aria-label="More options"
                            >
                              <DotsVerticalIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Portal-based Dropdown */}
      {openDropdown &&
        dropdownPosition &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 z-[99999] dropdown-menu"
            style={{
              left: `${dropdownPosition.x}px`,
              top: `${dropdownPosition.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const store = stores.find((s) => s.id === openDropdown);
                  if (store) {
                    handleEditStore(store.id);
                    closeDropdown();
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <EditIcon className="w-4 h-4" />
                Edit Store
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const store = stores.find((s) => s.id === openDropdown);
                  if (store) {
                    handleChooseTemplate(store.id);
                    closeDropdown();
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <TemplateIcon className="w-4 h-4" />
                Choose Template
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const store = stores.find((s) => s.id === openDropdown);
                  if (store) {
                    handleManageMenu(store.id);
                    closeDropdown();
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <MenuIcon className="w-4 h-4" />
                Manage Menu
              </button>

              <div className="border-t border-gray-200 my-1"></div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const store = stores.find((s) => s.id === openDropdown);
                  if (store) {
                    handleDeleteStore(store.id, store.name);
                    closeDropdown();
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Store
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
