import { supabase } from "@/lib/supabase";
import { Template, TemplateCategory, TemplateFeature } from "@/types/database";

export const templateService = {
  // Get all active templates (excluding coming soon)
  async getTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .eq("coming_soon", false)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching templates:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTemplates:", error);
      throw error;
    }
  },

  // Get all templates including coming soon
  async getAllTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching all templates:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getAllTemplates:", error);
      throw error;
    }
  },

  // Get featured templates (excluding coming soon)
  async getFeaturedTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .eq("coming_soon", false)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching featured templates:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getFeaturedTemplates:", error);
      throw error;
    }
  },

  // Get templates by category
  async getTemplatesByCategory(category: string): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .eq("category", category)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching templates by category:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTemplatesByCategory:", error);
      throw error;
    }
  },

  // Get template features
  async getTemplateFeatures(templateId: string): Promise<TemplateFeature[]> {
    try {
      const { data, error } = await supabase
        .from("template_features")
        .select("*")
        .eq("template_id", templateId)
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching template features:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTemplateFeatures:", error);
      throw error;
    }
  },

  // Get template categories
  async getTemplateCategories(): Promise<TemplateCategory[]> {
    try {
      const { data, error } = await supabase
        .from("template_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching template categories:", error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTemplateCategories:", error);
      throw error;
    }
  },

  // Get template with features
  async getTemplateWithFeatures(
    templateId: string
  ): Promise<{ template: Template; features: TemplateFeature[] } | null> {
    try {
      const [templateResult, featuresResult] = await Promise.all([
        supabase
          .from("templates")
          .select("*")
          .eq("id", templateId)
          .eq("is_active", true)
          .single(),
        this.getTemplateFeatures(templateId),
      ]);

      if (templateResult.error) {
        console.error("Error fetching template:", templateResult.error);
        throw new Error(templateResult.error.message);
      }

      if (!templateResult.data) {
        return null;
      }

      return {
        template: templateResult.data,
        features: featuresResult,
      };
    } catch (error) {
      console.error("Error in getTemplateWithFeatures:", error);
      throw error;
    }
  },

  // Apply template to store
  async applyTemplateToStore(
    storeId: string,
    templateId: string
  ): Promise<void> {
    try {
      // First, check if this template is already assigned to this store
      const { data: existingTemplate, error: checkError } = await supabase
        .from("store_templates")
        .select("id")
        .eq("store_id", storeId)
        .eq("template_id", templateId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error checking existing template:", checkError);
        throw new Error(checkError.message);
      }

      if (existingTemplate) {
        // Template already exists, just activate it and deactivate others
        const { error: updateError } = await supabase
          .from("store_templates")
          .update({
            is_active: true,
            applied_at: new Date().toISOString(),
            applied_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq("id", existingTemplate.id);

        if (updateError) {
          console.error("Error updating existing template:", updateError);
          throw new Error(updateError.message);
        }

        // Deactivate other templates for this store
        const { error: deactivateError } = await supabase
          .from("store_templates")
          .update({ is_active: false })
          .eq("store_id", storeId)
          .neq("id", existingTemplate.id);

        if (deactivateError) {
          console.error("Error deactivating other templates:", deactivateError);
          throw new Error(deactivateError.message);
        }
      } else {
        // Template doesn't exist, deactivate existing templates and insert new one
        const { error: deactivateError } = await supabase
          .from("store_templates")
          .update({ is_active: false })
          .eq("store_id", storeId)
          .eq("is_active", true);

        if (deactivateError) {
          console.error(
            "Error deactivating existing templates:",
            deactivateError
          );
          throw new Error(deactivateError.message);
        }

        // Insert the new template
        const { error } = await supabase.from("store_templates").insert({
          store_id: storeId,
          template_id: templateId,
          applied_at: new Date().toISOString(),
          applied_by: (await supabase.auth.getUser()).data.user?.id,
          is_active: true,
        });

        if (error) {
          console.error("Error applying template to store:", error);
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error("Error in applyTemplateToStore:", error);
      throw error;
    }
  },

  // Get store's current template
  async getStoreTemplate(
    storeId: string
  ): Promise<{ template: Template; features: TemplateFeature[] } | null> {
    try {
      // First get the store template assignment
      const { data: storeTemplates, error } = await supabase
        .from("store_templates")
        .select("template_id")
        .eq("store_id", storeId)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching store template:", error);
        throw new Error(error.message);
      }

      if (!storeTemplates || storeTemplates.length === 0) {
        return null;
      }

      // Get the first active template (there should only be one active per store)
      const storeTemplate = storeTemplates[0];

      // Then get the template details
      const { data: templates, error: templateError } = await supabase
        .from("templates")
        .select("*")
        .eq("id", storeTemplate.template_id);

      if (templateError) {
        console.error("Error fetching template:", templateError);
        throw new Error(templateError.message);
      }

      if (!templates || templates.length === 0) {
        console.error("Template not found for ID:", storeTemplate.template_id);
        return null;
      }

      const template = templates[0];

      // Get template features
      const features = await this.getTemplateFeatures(
        storeTemplate.template_id
      );

      return {
        template,
        features,
      };
    } catch (error) {
      console.error("Error in getStoreTemplate:", error);
      throw error;
    }
  },

  // Get template component ID from database template
  getTemplateComponentId(templateName: string): string {
    const templateMapping: { [key: string]: string } = {
      "Ramen Restaurant": "ramen-restaurant",
      "Modern Restaurant": "modern-restaurant",
      "Classic Cafe": "classic-cafe",
      "Boutique Retail": "boutique-retail",
      "Professional Service": "professional-service",
      "Creative Studio": "creative-studio",
      "Minimal Clean": "minimal-clean",
    };

    return templateMapping[templateName] || "default";
  },
};
