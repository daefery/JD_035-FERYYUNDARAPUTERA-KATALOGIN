import { CheckIcon } from "@/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import TemplateRenderer from "@/components/TemplateRenderer";
import { categoryService } from "@/services/categoryService";
import { menuItemService } from "@/services/menuItemService";
import { storeService } from "@/services/storeService";
import { Category, MenuItem, Store } from "@/types/database";
import { trackStoreVisit } from "@/utils/analytics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface StorePageProps {
  store: Store | null;
  categories: Category[];
  menuItems: MenuItem[];
  error?: string | null;
}

export default function StorePage({
  store,
  categories,
  menuItems,
  error,
}: StorePageProps) {
  const router = useRouter();
  const { slug, onboarding } = router.query;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (onboarding === "success") {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        // Remove the query parameter
        router.replace(`/store/${slug}`, undefined, { shallow: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onboarding, slug, router]);

  // Track store visit for analytics
  useEffect(() => {
    if (store?.id) {
      trackStoreVisit(store.id);
    }
  }, [store]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Store Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-5 h-5" />
            <span>
              Your store is now live! Share this URL with your customers.
            </span>
          </div>
        </div>
      )}

      {/* Store Content */}
      <TemplateRenderer
        store={store}
        categories={categories}
        menuItems={menuItems}
      />
    </div>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { slug } = params;

    // Get store data
    const store = await storeService.getStoreBySlug(slug);
    if (!store) {
      return {
        props: {
          store: null,
          categories: [],
          menuItems: [],
          error: "Store not found",
        },
      };
    }

    // Get categories and menu items
    const [categories, menuItems] = await Promise.all([
      categoryService.getCategories(store.id),
      menuItemService.getMenuItems(store.id),
    ]);

    return {
      props: {
        store,
        categories,
        menuItems,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error loading store:", error);
    return {
      props: {
        store: null,
        categories: [],
        menuItems: [],
        error: "Failed to load store",
      },
    };
  }
}
