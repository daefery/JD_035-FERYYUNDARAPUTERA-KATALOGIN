/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageUpload from "@/components/ImageUpload";
import Modal from "@/components/Modal";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import {
  categoryService,
  menuItemService,
  storeService,
} from "@/services/storeService";
import { templateService } from "@/services/templateService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuManagementStep from "./steps/MenuManagementStep";
import PreviewStep from "./steps/PreviewStep";
import StoreBasicStep from "./steps/StoreBasicStep";
import StoreLocationStep from "./steps/StoreLocationStep";
import StoreMediaStep from "./steps/StoreMediaStep";
import StoreSocialStep from "./steps/StoreSocialStep";
import TemplateStep from "./steps/TemplateStep";
import WelcomeStep from "./steps/WelcomeStep";
import { OnboardingFormData, OnboardingStepProps } from "./types";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
}

const OnboardingWizard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    store: {},
    categories: [],
    menuItems: [],
    template: null,
  });

  // Modal states for categories and menu items
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category_name: "",
    image_url: "",
    is_available: true,
    is_featured: false,
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/onboarding");
    }
  }, [user, loading, router]);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Katalogin!",
      description: "Let's create your first store in just a few steps",
      component: WelcomeStep,
    },
    {
      id: "store-basic",
      title: "Store Information",
      description: "Tell us about your store",
      component: StoreBasicStep,
    },
    {
      id: "store-media",
      title: "Store Media",
      description: "Add your logo and banner",
      component: StoreMediaStep,
    },
    {
      id: "store-location",
      title: "Store Location",
      description: "Set your store location",
      component: StoreLocationStep,
    },
    {
      id: "store-social",
      title: "Social Media",
      description: "Connect your social media accounts",
      component: StoreSocialStep,
    },
    {
      id: "menu-management",
      title: "Menu Management",
      description: "Create categories and add menu items",
      component: MenuManagementStep,
    },
    {
      id: "template",
      title: "Choose Template",
      description: "Select your store theme",
      component: TemplateStep,
    },
    {
      id: "preview",
      title: "Preview & Launch",
      description: "Preview your store and make it live",
      component: PreviewStep,
    },
  ];

  const handleNext = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));

    if (currentStep === steps.length - 1) {
      // Final step - create everything
      createStoreAndLaunch();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Category modal handlers
  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        categories: [
          ...prev.categories,
          { ...newCategory, id: Date.now().toString() },
        ],
      }));
      setNewCategory({ name: "", description: "" });
      setShowCategoryModal(false);
    }
  };

  const handleCancelCategory = () => {
    setNewCategory({ name: "", description: "" });
    setShowCategoryModal(false);
  };

  // Menu item modal handlers
  const handleAddMenuItem = () => {
    if (newMenuItem.name.trim() && newMenuItem.price) {
      setFormData((prev) => ({
        ...prev,
        menuItems: [
          ...prev.menuItems,
          { ...newMenuItem, id: Date.now().toString() },
        ],
      }));
      setNewMenuItem({
        name: "",
        description: "",
        price: "",
        category_name: "",
        image_url: "",
        is_available: true,
        is_featured: false,
      });
      setShowMenuItemModal(false);
    }
  };

  const handleCancelMenuItem = () => {
    setNewMenuItem({
      name: "",
      description: "",
      price: "",
      category_name: "",
      image_url: "",
      is_available: true,
      is_featured: false,
    });
    setShowMenuItemModal(false);
  };

  const createStoreAndLaunch = async () => {
    try {
      // Generate unique slug if not provided
      let finalSlug = formData.store?.slug;
      if (!finalSlug && formData.store?.name) {
        finalSlug = await storeService.generateUniqueSlug(formData.store.name);
      }

      // 1. Create store
      const store = await storeService.createStore({
        ...formData.store,
        slug: finalSlug,
        is_active: true,
      } as any);

      // 2. Create categories
      const categoryMap = new Map(); // To map category names to IDs
      for (const category of formData.categories || []) {
        const createdCategory = await categoryService.createCategory({
          store_id: store.id,
          name: category.name,
          description: category.description,
          sort_order: 0,
        });
        categoryMap.set(category.name, createdCategory.id);
      }

      // 3. Create menu items
      for (const menuItem of formData.menuItems || []) {
        const categoryId = categoryMap.get(menuItem.category_name);
        await menuItemService.createMenuItem({
          store_id: store.id,
          name: menuItem.name,
          description: menuItem.description,
          price: parseFloat(menuItem.price),
          image_url: menuItem.image_url,
          category_id: categoryId,
          is_available: menuItem.is_available,
          is_featured: menuItem.is_featured,
          sort_order: 0,
        });
      }

      // 4. Apply template if selected
      if (formData.template) {
        await templateService.applyTemplateToStore(
          store.id,
          formData.template.id
        );
      }

      // 5. Redirect to store preview
      router.push(`/store/${store.slug}?onboarding=success`);
    } catch (error) {
      console.error("Error creating store:", error);
      // Handle error
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-white">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen p-2 md:p-4">
        {/* Progress Bar */}
        <div className="mb-6">
          {/* Mobile Progress - Show current step info */}
          <div className="md:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {steps[currentStep].description}
              </p>
            </div>
            {/* Simple progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Desktop Progress - Show all steps */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center mb-4 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        index < currentStep ? "bg-purple-600" : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-300 mt-2">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto px-2">
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
            isLastStep={currentStep === steps.length - 1}
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            showMenuItemModal={showMenuItemModal}
            setShowMenuItemModal={setShowMenuItemModal}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            newMenuItem={newMenuItem}
            setNewMenuItem={setNewMenuItem}
          />
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={handleCancelCategory}
        title="Add New Category"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
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
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of the category"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!newCategory.name.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Add Category
            </button>
            <button
              type="button"
              onClick={handleCancelCategory}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Menu Item Modal */}
      <Modal
        isOpen={showMenuItemModal}
        onClose={handleCancelMenuItem}
        title="Add New Menu Item"
        size="2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={newMenuItem.name}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, name: e.target.value })
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
              value={newMenuItem.description}
              onChange={(e) =>
                setNewMenuItem({ ...newMenuItem, description: e.target.value })
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
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, price: e.target.value })
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
                value={newMenuItem.category_name}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    category_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">No Category</option>
                {formData.categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <ImageUpload
              value={newMenuItem.image_url}
              onChange={(url) =>
                setNewMenuItem({ ...newMenuItem, image_url: url })
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
                checked={newMenuItem.is_available}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
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
                checked={newMenuItem.is_featured}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
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
              type="button"
              onClick={handleAddMenuItem}
              disabled={!newMenuItem.name.trim() || !newMenuItem.price}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={handleCancelMenuItem}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OnboardingWizard;
