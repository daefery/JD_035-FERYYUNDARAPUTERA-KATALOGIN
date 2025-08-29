import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ParticleBackground from '@/components/ParticleBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import ImageUpload from '@/components/ImageUpload';
import { storeService, categoryService, menuItemService } from '@/services/storeService';
import { Store, Category, MenuItem, CreateCategoryData, CreateMenuItemData, UpdateCategoryData, UpdateMenuItemData } from '@/types/database';

export default function MenuManagementPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Category management
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CreateCategoryData>({
    store_id: '',
    name: '',
    description: '',
    sort_order: 0
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  // Menu item management
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuItemForm, setMenuItemForm] = useState<CreateMenuItemData>({
    store_id: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: '',
    is_available: true,
    is_featured: false,
    sort_order: 0
  });
  const [isCreatingMenuItem, setIsCreatingMenuItem] = useState(false);
  const [isUpdatingMenuItem, setIsUpdatingMenuItem] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load store and menu data
  useEffect(() => {
    if (id && typeof id === 'string' && user) {
      loadStoreAndMenu(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadStoreAndMenu = async (storeId: string) => {
    try {
      setIsLoading(true);
      const storeData = await storeService.getStore(storeId);
      
      if (!storeData) {
        setError('Store not found');
        return;
      }

      // Check if user owns this store
      if (storeData.user_id !== user?.id) {
        setError('You do not have permission to edit this store');
        return;
      }

      setStore(storeData);
      
      // Load categories and menu items
      const categoriesData = await categoryService.getCategories(storeId);
      setCategories(categoriesData);

      const menuItemsData = await menuItemService.getMenuItems(storeId);
      setMenuItems(menuItemsData);

      // Initialize forms with store_id
      setCategoryForm(prev => ({ ...prev, store_id: storeId }));
      setMenuItemForm(prev => ({ ...prev, store_id: storeId }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load store');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        setIsUpdatingCategory(true);
        setError('');

        const updateData: UpdateCategoryData = {
          name: categoryForm.name,
          description: categoryForm.description,
          sort_order: categoryForm.sort_order
        };

        await categoryService.updateCategory(editingCategory.id, updateData);
        const updatedCategories = await categoryService.getCategories(store!.id);
        setCategories(updatedCategories);
        setCategoryForm({ store_id: store!.id, name: '', description: '', sort_order: 0 });
        setEditingCategory(null);
        setShowCategoryForm(false);
      } else {
        // Create new category
        setIsCreatingCategory(true);
        setError('');

        const newCategory: CreateCategoryData = {
          store_id: store!.id,
          name: categoryForm.name,
          description: categoryForm.description,
          sort_order: categoryForm.sort_order
        };

        await categoryService.createCategory(newCategory);
        const updatedCategories = await categoryService.getCategories(store!.id);
        setCategories(updatedCategories);
        setCategoryForm({ store_id: store!.id, name: '', description: '', sort_order: 0 });
        setShowCategoryForm(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setIsCreatingCategory(false);
      setIsUpdatingCategory(false);
    }
  };

  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!menuItemForm.name.trim()) {
      setError('Item name is required');
      return;
    }

    if (menuItemForm.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      if (editingMenuItem) {
        // Update existing menu item
        setIsUpdatingMenuItem(true);
        setError('');

        const updateData: UpdateMenuItemData = {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: menuItemForm.price,
          image_url: menuItemForm.image_url,
          category_id: menuItemForm.category_id || undefined,
          is_available: menuItemForm.is_available,
          is_featured: menuItemForm.is_featured,
          sort_order: menuItemForm.sort_order
        };

        await menuItemService.updateMenuItem(editingMenuItem.id, updateData);
        const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
        setMenuItems(updatedMenuItems);
        setMenuItemForm({ 
          store_id: store!.id, 
          name: '', 
          description: '', 
          price: 0, 
          image_url: '', 
          category_id: '', 
          is_available: true, 
          is_featured: false, 
          sort_order: 0 
        });
        setEditingMenuItem(null);
        setShowMenuItemForm(false);
      } else {
        // Create new menu item
        setIsCreatingMenuItem(true);
        setError('');

        const newMenuItem: CreateMenuItemData = {
          store_id: store!.id,
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: menuItemForm.price,
          image_url: menuItemForm.image_url,
          category_id: menuItemForm.category_id || undefined,
          is_available: menuItemForm.is_available,
          is_featured: menuItemForm.is_featured,
          sort_order: menuItemForm.sort_order
        };

        await menuItemService.createMenuItem(newMenuItem);
        const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
        setMenuItems(updatedMenuItems);
        setMenuItemForm({ 
          store_id: store!.id, 
          name: '', 
          description: '', 
          price: 0, 
          image_url: '', 
          category_id: '', 
          is_available: true, 
          is_featured: false, 
          sort_order: 0 
        });
        setShowMenuItemForm(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu item');
    } finally {
      setIsCreatingMenuItem(false);
      setIsUpdatingMenuItem(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? All menu items in this category will also be deleted.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      const updatedCategories = await categoryService.getCategories(store!.id);
      setCategories(updatedCategories);
      setMenuItems(menuItems.filter(item => item.category_id !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await menuItemService.deleteMenuItem(itemId);
      const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
      setMenuItems(updatedMenuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      store_id: category.store_id,
      name: category.name,
      description: category.description || '',
      sort_order: category.sort_order
    });
    setShowCategoryForm(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setMenuItemForm({
      store_id: menuItem.store_id,
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      image_url: menuItem.image_url || '',
      category_id: menuItem.category_id || '',
      is_available: menuItem.is_available,
      is_featured: menuItem.is_featured,
      sort_order: menuItem.sort_order
    });
    setShowMenuItemForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingMenuItem(null);
    setCategoryForm({ store_id: store!.id, name: '', description: '', sort_order: 0 });
    setMenuItemForm({ 
      store_id: store!.id, 
      name: '', 
      description: '', 
      price: 0, 
      image_url: '', 
      category_id: '', 
      is_available: true, 
      is_featured: false, 
      sort_order: 0 
    });
    setShowCategoryForm(false);
    setShowMenuItemForm(false);
  };

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!store) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Store Not Found</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Stores
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
              <p className="text-gray-300">Manage categories and menu items for {store.name}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Stores
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Categories</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add Category
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium">{category.name}</h3>
                        {category.description && (
                          <p className="text-gray-300 text-sm mt-1">{category.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-400 hover:text-blue-300 text-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Category Form */}
              {showCategoryForm && (
                <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-4">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Appetizers"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Description
                      </label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Brief description of the category"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isCreatingCategory || isUpdatingCategory}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isCreatingCategory || isUpdatingCategory ? 'Saving...' : 'Save Category'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Menu Items Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Menu Items</h2>
                <button
                  onClick={() => setShowMenuItemForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add Item
                </button>
              </div>

              {/* Menu Items List */}
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      {item.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <span className="text-green-400 font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        {item.description && (
                          <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </span>
                          {item.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleEditMenuItem(item)}
                        className="text-blue-400 hover:text-blue-300 text-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Menu Item Form */}
              {showMenuItemForm && (
                <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-4">
                    {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h3>
                  <form onSubmit={handleMenuItemSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={menuItemForm.name}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Spring Rolls"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Description
                      </label>
                      <textarea
                        value={menuItemForm.description}
                        onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Brief description of the item"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={menuItemForm.price}
                          onChange={(e) => setMenuItemForm({ ...menuItemForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Category
                        </label>
                        <select
                          value={menuItemForm.category_id}
                          onChange={(e) => setMenuItemForm({ ...menuItemForm, category_id: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">No Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <ImageUpload
                        value={menuItemForm.image_url}
                        onChange={(url) => setMenuItemForm({ ...menuItemForm, image_url: url })}
                        label="Item Image"
                        placeholder="https://example.com/item-image.jpg"
                        bucketName="gallery"
                        folder="menu-items"
                        maxSize={3}
                      />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={menuItemForm.is_available}
                          onChange={(e) => setMenuItemForm({ ...menuItemForm, is_available: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-white text-sm">Available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={menuItemForm.is_featured}
                          onChange={(e) => setMenuItemForm({ ...menuItemForm, is_featured: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-white text-sm">Featured</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isCreatingMenuItem || isUpdatingMenuItem}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isCreatingMenuItem || isUpdatingMenuItem ? 'Saving...' : 'Save Item'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
