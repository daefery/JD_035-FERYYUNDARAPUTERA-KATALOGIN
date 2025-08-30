export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreData {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  is_active?: boolean;
}

export interface UpdateStoreData {
  name?: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  is_active?: boolean;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  store_id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface MenuItem {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItemWithCategory extends MenuItem {
  category?: Category;
}

export interface CreateMenuItemData {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

export interface UpdateMenuItemData {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category_id?: string;
  is_available?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

export interface Template {
  features: TemplateFeature[];
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image_url?: string;
  thumbnail_url?: string;
  is_active: boolean;
  is_featured: boolean;
  coming_soon: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateFeature {
  id: string;
  template_id: string;
  feature_name: string;
  feature_description?: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StoreTemplate {
  id: string;
  store_id: string;
  template_id: string;
  applied_at: string;
  applied_by?: string;
  is_active: boolean;
  created_at: string;
}
