import RamenRestaurantTemplate from './RamenRestaurantTemplate';
import DefaultTemplate from './DefaultTemplate';
import { Store, Category, MenuItem } from '@/types/database';

// Template registry - maps template IDs to components
export const templateComponents = {
  'default': DefaultTemplate,
  'modern-restaurant': RamenRestaurantTemplate,
  // Add more templates here as they are created
};

// Template metadata
export const templateMetadata = {
  'default': {
    name: 'Default',
    description: 'Default template for stores without a specific theme',
    category: 'Default',
    features: [
      'Clean layout',
      'Responsive design',
      'Menu organization',
      'Contact information'
    ]
  },
  'ramen-restaurant': {
    name: 'Ramen Restaurant',
    description: 'A sophisticated dark theme inspired by authentic ramen restaurants',
    category: 'Restaurant',
    features: [
      'Dark chalkboard background',
      'Clean white cards',
      'Warm brown accents',
      'Ramen-specific layout',
      'Elegant typography'
    ]
  }
};

// Export individual templates
export { RamenRestaurantTemplate, DefaultTemplate };

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
