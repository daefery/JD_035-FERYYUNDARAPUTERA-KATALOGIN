import { templateService } from "@/services/templateService";
import { getTemplateComponent } from "@/templates";
import { Category, MenuItem, Store, Template } from "@/types/database";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface TemplateRendererProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  store,
  categories,
  menuItems,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoreTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.id]);

  const loadStoreTemplate = async () => {
    try {
      setIsLoading(true);

      // Get the store's selected template from database
      const storeTemplate = await templateService.getStoreTemplate(store.id);

      if (storeTemplate) {
        setSelectedTemplate(storeTemplate.template);
      } else {
        // Use default template if no template is selected
        console.log("No template found for store, using default template");
        setSelectedTemplate({
          id: "default",
          name: "Default",
          description: "Default template",
          category: "Default",
          is_active: true,
          is_featured: false,
          coming_soon: false,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error loading store template:", err);
      // Don't show error to user, just use default template
      setSelectedTemplate({
        id: "default",
        name: "Default",
        description: "Default template",
        category: "Default",
        is_active: true,
        is_featured: false,
        coming_soon: false,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Template Found
          </h2>
          <p className="text-gray-600">
            Please select a template for this store.
          </p>
        </div>
      </div>
    );
  }

  // Get the template component ID from the database template name
  const templateComponentId = templateService.getTemplateComponentId(
    selectedTemplate.name
  );

  // Get the actual template component
  const TemplateComponent = getTemplateComponent(templateComponentId);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Template Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Template &quot;{selectedTemplate.name}&quot; is not available.
          </p>
          <p className="text-sm text-gray-500">
            Template ID: {templateComponentId}
          </p>
        </div>
      </div>
    );
  }

  // Render the template with store data
  return (
    <TemplateComponent
      store={store}
      categories={categories}
      menuItems={menuItems}
    />
  );
};

export default TemplateRenderer;
