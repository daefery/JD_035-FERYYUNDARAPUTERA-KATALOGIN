import ImageUpload from "@/components/ImageUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import {
  categoryService,
  menuItemService,
  storeService,
} from "@/services/storeService";
import {
  Category,
  CreateCategoryData,
  CreateMenuItemData,
  MenuItem,
  MenuItemWithCategory,
  Store,
  UpdateCategoryData,
  UpdateMenuItemData,
} from "@/types/database";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MenuManagementPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Category management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CreateCategoryData>({
    store_id: "",
    name: "",
    description: "",
    sort_order: 0,
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  // Menu item management
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuItemForm, setMenuItemForm] = useState<CreateMenuItemData>({
    store_id: "",
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category_id: "",
    is_available: true,
    is_featured: false,
    sort_order: 0,
  });
  const [isCreatingMenuItem, setIsCreatingMenuItem] = useState(false);
  const [isUpdatingMenuItem, setIsUpdatingMenuItem] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load store and menu data
  useEffect(() => {
    if (id && typeof id === "string" && user) {
      loadStoreAndMenu(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadStoreAndMenu = async (storeId: string) => {
    try {
      setIsLoading(true);
      const storeData = await storeService.getStore(storeId);

      if (!storeData) {
        setError("Store not found");
        return;
      }

      // Check if user owns this store
      if (storeData.user_id !== user?.id) {
        setError("You do not have permission to edit this store");
        return;
      }

      setStore(storeData);

      // Load categories and menu items
      const categoriesData = await categoryService.getCategories(storeId);
      setCategories(categoriesData);

      const menuItemsData = await menuItemService.getMenuItems(storeId);
      setMenuItems(menuItemsData);

      // Initialize forms with store_id
      setCategoryForm((prev) => ({ ...prev, store_id: storeId }));
      setMenuItemForm((prev) => ({ ...prev, store_id: storeId }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load store");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        setIsUpdatingCategory(true);
        setError("");

        const updateData: UpdateCategoryData = {
          name: categoryForm.name,
          description: categoryForm.description,
          sort_order: categoryForm.sort_order,
        };

        await categoryService.updateCategory(editingCategory.id, updateData);
        const updatedCategories = await categoryService.getCategories(
          store!.id
        );
        setCategories(updatedCategories);
        setCategoryForm({
          store_id: store!.id,
          name: "",
          description: "",
          sort_order: 0,
        });
        setEditingCategory(null);
        setShowCategoryModal(false);
      } else {
        // Create new category
        setIsCreatingCategory(true);
        setError("");

        const newCategory: CreateCategoryData = {
          store_id: store!.id,
          name: categoryForm.name,
          description: categoryForm.description,
          sort_order: categoryForm.sort_order,
        };

        await categoryService.createCategory(newCategory);
        const updatedCategories = await categoryService.getCategories(
          store!.id
        );
        setCategories(updatedCategories);
        setCategoryForm({
          store_id: store!.id,
          name: "",
          description: "",
          sort_order: 0,
        });
        setShowCategoryModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsCreatingCategory(false);
      setIsUpdatingCategory(false);
    }
  };

  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuItemForm.name.trim()) {
      setError("Item name is required");
      return;
    }

    if (menuItemForm.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      if (editingMenuItem) {
        // Update existing menu item
        setIsUpdatingMenuItem(true);
        setError("");

        const updateData: UpdateMenuItemData = {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: menuItemForm.price,
          image_url: menuItemForm.image_url,
          category_id: menuItemForm.category_id || undefined,
          is_available: menuItemForm.is_available,
          is_featured: menuItemForm.is_featured,
          sort_order: menuItemForm.sort_order,
        };

        await menuItemService.updateMenuItem(editingMenuItem.id, updateData);
        const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
        setMenuItems(updatedMenuItems);
        setMenuItemForm({
          store_id: store!.id,
          name: "",
          description: "",
          price: 0,
          image_url: "",
          category_id: "",
          is_available: true,
          is_featured: false,
          sort_order: 0,
        });
        setEditingMenuItem(null);
        setShowMenuItemModal(false);
      } else {
        // Create new menu item
        setIsCreatingMenuItem(true);
        setError("");

        const newMenuItem: CreateMenuItemData = {
          store_id: store!.id,
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: menuItemForm.price,
          image_url: menuItemForm.image_url,
          category_id: menuItemForm.category_id || undefined,
          is_available: menuItemForm.is_available,
          is_featured: menuItemForm.is_featured,
          sort_order: menuItemForm.sort_order,
        };

        await menuItemService.createMenuItem(newMenuItem);
        const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
        setMenuItems(updatedMenuItems);
        setMenuItemForm({
          store_id: store!.id,
          name: "",
          description: "",
          price: 0,
          image_url: "",
          category_id: "",
          is_available: true,
          is_featured: false,
          sort_order: 0,
        });
        setShowMenuItemModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save menu item");
    } finally {
      setIsCreatingMenuItem(false);
      setIsUpdatingMenuItem(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? All menu items in this category will also be deleted."
      )
    ) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      const updatedCategories = await categoryService.getCategories(store!.id);
      setCategories(updatedCategories);
      setMenuItems(menuItems.filter((item) => item.category_id !== categoryId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      await menuItemService.deleteMenuItem(itemId);
      const updatedMenuItems = await menuItemService.getMenuItems(store!.id);
      setMenuItems(updatedMenuItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete menu item"
      );
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      store_id: category.store_id,
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order,
    });
    setShowCategoryModal(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setMenuItemForm({
      store_id: menuItem.store_id,
      name: menuItem.name,
      description: menuItem.description || "",
      price: menuItem.price,
      image_url: menuItem.image_url || "",
      category_id: menuItem.category_id || "",
      is_available: menuItem.is_available,
      is_featured: menuItem.is_featured,
      sort_order: menuItem.sort_order,
    });
    setShowMenuItemModal(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingMenuItem(null);
    setCategoryForm({
      store_id: store!.id,
      name: "",
      description: "",
      sort_order: 0,
    });
    setMenuItemForm({
      store_id: store!.id,
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category_id: "",
      is_available: true,
      is_featured: false,
      sort_order: 0,
    });
    setShowCategoryModal(false);
    setShowMenuItemModal(false);
  };

  // Drag and drop handlers
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over?.id);

      const newMenuItems = arrayMove(menuItems, oldIndex, newIndex);
      setMenuItems(newMenuItems);

      // Update sort_order for all items
      try {
        setIsReordering(true);
        const updatePromises = newMenuItems.map((item, index) =>
          menuItemService.updateMenuItem(item.id, {
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: item.category_id,
            is_available: item.is_available,
            is_featured: item.is_featured,
            sort_order: index,
          })
        );
        await Promise.all(updatePromises);
      } catch (err) {
        setError("Failed to save new order");
        console.error(err);
        // Revert to original order
        const originalMenuItems = await menuItemService.getMenuItems(store!.id);
        setMenuItems(originalMenuItems);
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Sortable Menu Item Component
  const SortableMenuItem = ({ item }: { item: MenuItemWithCategory }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white/5 rounded-lg p-4 border border-white/10 ${
          isDragging ? "shadow-lg" : ""
        }`}
      >
        <div className="flex gap-4 items-start">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded transition-colors"
            title="Drag to reorder"
          >
            <svg
              className="w-5 h-5 text-gray-400 hover:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>

          {/* Item Image */}
          {item.image_url && (
            <div className="flex-shrink-0">
              <Image
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                width={100}
                height={100}
              />
            </div>
          )}

          {/* Item Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium">{item.name}</h3>
              <span className="text-green-400 font-medium">
                Rp. {Number(item.price).toLocaleString("id-ID")}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-300 text-sm mt-1">{item.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.is_available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </span>
              {item.is_featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div>
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
      </div>
    );
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
            <h2 className="text-2xl font-bold text-white mb-4">
              Store Not Found
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push("/dashboard/stores")}
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Menu Management
              </h1>
              <p className="text-gray-300">
                Manage categories and menu items for {store.name}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/stores")}
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
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add Category
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-300 text-sm mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Items Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Menu Items
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Drag and drop to reorder items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {isReordering && (
                    <div className="flex items-center text-sm text-yellow-400">
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving order...
                    </div>
                  )}
                  <button
                    onClick={() => setShowMenuItemModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Menu Items List with Drag & Drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <SortableMenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Empty State */}
              {menuItems.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300 mb-4">No menu items yet</p>
                  <p className="text-gray-400 text-sm">
                    Drag and drop items to reorder them once you add some
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={handleCancelEdit}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        size="md"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  name: e.target.value,
                })
              }
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
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of the category"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isCreatingCategory || isUpdatingCategory}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isCreatingCategory || isUpdatingCategory
                ? "Saving..."
                : "Save Category"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Menu Item Modal */}
      <Modal
        isOpen={showMenuItemModal}
        onClose={handleCancelEdit}
        title={editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        size="2xl"
      >
        <form onSubmit={handleMenuItemSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={menuItemForm.name}
              onChange={(e) =>
                setMenuItemForm({
                  ...menuItemForm,
                  name: e.target.value,
                })
              }
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
              onChange={(e) =>
                setMenuItemForm({
                  ...menuItemForm,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of the item"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={menuItemForm.price}
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
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
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    category_id: e.target.value,
                  })
                }
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
              onChange={(url) =>
                setMenuItemForm({ ...menuItemForm, image_url: url })
              }
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
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    is_available: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-white text-sm">Available</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={menuItemForm.is_featured}
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    is_featured: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-white text-sm">Featured</span>
            </label>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isCreatingMenuItem || isUpdatingMenuItem}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isCreatingMenuItem || isUpdatingMenuItem
                ? "Saving..."
                : "Save Item"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
