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

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Stores</h1>
              <p className="text-gray-300">
                Manage your restaurant and store catalogs
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Store
            </button>

            <button
              onClick={() => router.push("/dashboard/analytics")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No stores yet
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Create your first store to start building your food catalog
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
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
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
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {store.address}
                          </div>
                        )}
                        {store.phone && (
                          <div className="flex items-center text-sm text-gray-300">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {store.phone}
                          </div>
                        )}
                        {store.email && (
                          <div className="flex items-center text-sm text-gray-300">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
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
                            onClick={(event) => toggleDropdown(store.id, event)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors dropdown-button"
                            aria-label="More options"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5v14m8-7h-2m0 0h-2m2 0v2m0-2v-2M3 11h6m-6 4h6m11 4H4c-.55228 0-1-.4477-1-1V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v12c0 .5523-.4477 1-1 1Z"
                  />
                </svg>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                  />
                </svg>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Store
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
