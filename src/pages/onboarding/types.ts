import { Template } from "@/types/database";

export interface OnboardingFormData {
  store: {
    name?: string;
    slug?: string;
    description?: string;
    phone?: string;
    email?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    tiktok_url?: string;
    logo_url?: string;
    banner_url?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  menuItems: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    category_name: string;
    image_url: string;
    is_available: boolean;
    is_featured: boolean;
  }>;
  template: Template | null;
}

export interface OnboardingStepProps {
  onNext: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  data: OnboardingFormData;
  isLastStep: boolean;
  // Modal props for categories and menu items
  showCategoryModal?: boolean;
  setShowCategoryModal?: (show: boolean) => void;
  showMenuItemModal?: boolean;
  setShowMenuItemModal?: (show: boolean) => void;
  newCategory?: { name: string; description: string };
  setNewCategory?: (category: { name: string; description: string }) => void;
  newMenuItem?: {
    name: string;
    description: string;
    price: string;
    category_name: string;
    image_url: string;
    is_available: boolean;
    is_featured: boolean;
  };
  setNewMenuItem?: (item: {
    name: string;
    description: string;
    price: string;
    category_name: string;
    image_url: string;
    is_available: boolean;
    is_featured: boolean;
  }) => void;
}
