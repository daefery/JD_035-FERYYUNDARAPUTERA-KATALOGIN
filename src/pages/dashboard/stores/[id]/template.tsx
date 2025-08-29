import LoadingSpinner from "@/components/LoadingSpinner";
import ParticleBackground from "@/components/ParticleBackground";
import { useAuth } from "@/contexts/AuthContext";
import { storeService } from "@/services/storeService";
import { templateService } from "@/services/templateService";
import { Store, Template, TemplateFeature } from "@/types/database";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface TemplateWithFeatures extends Template {
  features: TemplateFeature[];
}

export default function TemplateSelectionPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [templates, setTemplates] = useState<TemplateWithFeatures[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load store data
  useEffect(() => {
    if (id && typeof id === "string" && user) {
      loadStore(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadStore = async (storeId: string) => {
    try {
      setIsLoading(true);
      const [storeData, templatesData] = await Promise.all([
        storeService.getStore(storeId),
        templateService.getAllTemplates(), // Get all templates including coming soon
      ]);

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

      // Load features for each template
      const templatesWithFeatures = await Promise.all(
        templatesData.map(async (template) => {
          const features = await templateService.getTemplateFeatures(
            template.id
          );
          return {
            ...template,
            features,
          };
        })
      );

      setTemplates(templatesWithFeatures);

      // Load current template for this store
      try {
        const storeTemplate = await templateService.getStoreTemplate(storeId);
        if (storeTemplate) {
          setCurrentTemplate(storeTemplate.template);
          setSelectedTemplate(storeTemplate.template.id);
        }
      } catch (err) {
        console.log("No template currently applied to this store", err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load store");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template && !template.coming_soon) {
      // Don't allow selecting the current template
      if (currentTemplate && templateId === currentTemplate.id) {
        return;
      }
      setSelectedTemplate(templateId);
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate || !store) return;

    try {
      setIsApplying(true);
      setError("");

      // Apply template to store using the service
      await templateService.applyTemplateToStore(store.id, selectedTemplate);

      // Show success message
      alert(`Template applied successfully!`);

      // Redirect back to stores list
      router.push("/dashboard/stores");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply template");
    } finally {
      setIsApplying(false);
    }
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
                Choose Template
              </h1>
              <p className="text-gray-300">
                Select a template for {store.name}
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

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => {
              const isCurrentTemplate =
                currentTemplate && template.id === currentTemplate.id;
              const isSelected = selectedTemplate === template.id;
              const isDisabled = template.coming_soon || isCurrentTemplate;

              return (
                <div
                  key={template.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border transition-all duration-200 ${
                    isDisabled
                      ? "border-gray-500/50 opacity-60 cursor-not-allowed"
                      : isSelected
                      ? "border-purple-500 bg-purple-500/20 cursor-pointer"
                      : "border-white/20 hover:border-white/40 cursor-pointer"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {/* Template Preview */}
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {template.thumbnail_url ? (
                      <Image
                        src={template.thumbnail_url}
                        alt={template.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {template.name}
                      </span>
                    )}

                    {/* Coming Soon Overlay */}
                    {template.coming_soon && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-bold text-lg mb-1">
                            Coming Soon
                          </div>
                          <div className="text-white/80 text-sm">
                            Stay tuned!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Current Template Overlay */}
                    {isCurrentTemplate && (
                      <div className="absolute inset-0 bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg mb-1">
                            Currently Applied
                          </div>
                          <div className="text-green-300 text-sm">
                            Active Template
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {template.features.slice(0, 4).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature.feature_name}
                      </div>
                    ))}
                    {template.features.length > 4 && (
                      <div className="text-xs text-gray-400 mt-2">
                        +{template.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {template.is_featured &&
                        !template.coming_soon &&
                        !isCurrentTemplate && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      {template.coming_soon && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Coming Soon
                        </span>
                      )}
                      {isCurrentTemplate && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                      {isSelected &&
                        !template.coming_soon &&
                        !isCurrentTemplate && (
                          <svg
                            className="w-6 h-6 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apply Template Button */}
          {selectedTemplate && selectedTemplate !== currentTemplate?.id && (
            <div className="flex justify-center">
              <button
                onClick={handleApplyTemplate}
                disabled={isApplying}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Applying Template...
                  </div>
                ) : (
                  `Apply ${
                    templates.find((t) => t.id === selectedTemplate)?.name
                  } Template`
                )}
              </button>
            </div>
          )}

          {/* Current Template Message */}
          {currentTemplate && !selectedTemplate && (
            <div className="text-center">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  Template Already Applied
                </h3>
                <p className="text-green-300 mb-4">
                  This store is currently using the{" "}
                  <strong>{currentTemplate.name}</strong> template.
                </p>
                <p className="text-green-200 text-sm">
                  Select a different template above to change the current theme.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
