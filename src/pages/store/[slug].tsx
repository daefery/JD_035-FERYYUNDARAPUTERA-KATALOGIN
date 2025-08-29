import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LoadingSpinner from '@/components/LoadingSpinner';
import { storeService } from '@/services/storeService';
import { categoryService, menuItemService } from '@/services/storeService';
import { Store, Category, MenuItem } from '@/types/database';
import TemplateRenderer from '@/components/TemplateRenderer';

export default function StorePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      loadStoreData(slug);
    }
  }, [slug]);

  const loadStoreData = async (storeSlug: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load store data
      const storeData = await storeService.getStoreBySlug(storeSlug);
      
      if (!storeData) {
        setError('Store not found');
        return;
      }

      if (!storeData.is_active) {
        setError('This store is currently inactive');
        return;
      }

      setStore(storeData);

      // Load categories and menu items with error handling
      try {
        const [categoriesData, menuItemsData] = await Promise.all([
          categoryService.getCategories(storeData.id),
          menuItemService.getMenuItems(storeData.id)
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (menuError) {
        console.error('Error loading menu data:', menuError);
        // Don't fail the entire page, just set empty arrays
        setCategories([]);
        setMenuItems([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load store');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error
  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The store you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{store.name} - Katalogin</title>
        <meta name="description" content={store.description || `Visit ${store.name} on Katalogin`} />
        <meta property="og:title" content={`${store.name} - Katalogin`} />
        <meta property="og:description" content={store.description || `Visit ${store.name} on Katalogin`} />
        {store.logo_url && <meta property="og:image" content={store.logo_url} />}
      </Head>

      {/* Render the store using the selected template */}
      <TemplateRenderer
        store={store}
        categories={categories}
        menuItems={menuItems}
      />
    </>
  );
}
