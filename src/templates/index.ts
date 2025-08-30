import { Category, MenuItem, Store } from "@/types/database";
import DefaultTemplate from "./DefaultTemplate";
import ModernRestaurantTemplate from "./ModernRestaurantTemplate";
import RamenRestaurantTemplate from "./RamenRestaurantTemplate";

// Template registry - maps template IDs to components
export const templateComponents = {
  default: ModernRestaurantTemplate,
  "modern-restaurant": ModernRestaurantTemplate,
  // Add more templates here as they are created
};

// Export individual templates
export { DefaultTemplate, ModernRestaurantTemplate, RamenRestaurantTemplate };

// Type for template props
export interface TemplateProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
}

// Helper function to get template component
export const getTemplateComponent = (templateId: string) => {
  return templateComponents[templateId as keyof typeof templateComponents];
};
