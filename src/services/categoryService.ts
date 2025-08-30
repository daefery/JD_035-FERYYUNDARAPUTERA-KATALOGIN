import { supabase } from "@/lib/supabase";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/database";

export const categoryService = {
  // Get all categories for a store
  async getCategories(storeId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("store_id", storeId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a single category
  async getCategory(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a category
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
  },

  // Reorder categories
  async reorderCategories(
    storeId: string,
    categoryIds: string[]
  ): Promise<void> {
    const updates = categoryIds.map((id, index) => ({
      id,
      sort_order: index + 1,
    }));

    const { error } = await supabase
      .from("categories")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;
  },
};
