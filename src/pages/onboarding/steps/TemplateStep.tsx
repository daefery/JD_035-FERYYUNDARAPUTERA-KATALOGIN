/* eslint-disable @typescript-eslint/no-explicit-any */
import { templateService } from "@/services/templateService";
import { Template, TemplateFeature } from "@/types/database";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OnboardingStepProps } from "../types";

const TemplateStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [templates, setTemplates] = useState<
    (Template & { features: TemplateFeature[] })[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    data.template || null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await templateService.getAllTemplates();

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

      setTemplates(
        templatesWithFeatures as (Template & { features: TemplateFeature[] })[]
      );
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    if (!template.coming_soon) {
      setSelectedTemplate(template);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ template: selectedTemplate });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-white">Loading templates...</div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">
            Choose Your Store Theme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const isComingSoon = template.coming_soon;

              return (
                <div
                  key={template.id}
                  className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/20 cursor-pointer"
                      : isComingSoon
                      ? "border-gray-500/30 bg-gray-500/10 cursor-not-allowed"
                      : "border-white/20 hover:border-white/40 cursor-pointer bg-white/5"
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  {/* Template Preview */}
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {template.thumbnail_url ? (
                      <Image
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {template.name}
                      </span>
                    )}

                    {/* Coming Soon Overlay */}
                    {isComingSoon && (
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

                    {/* Selected Template Overlay */}
                    {/* {isSelected && !isComingSoon && (
                      <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-purple-300 font-bold text-lg mb-1">
                            Selected
                          </div>
                          <div className="text-purple-200 text-sm">
                            This template will be applied
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Template Info */}
                  {/* <h3 className="text-lg font-semibold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {template.description}
                  </p> */}

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {(template as any).features &&
                      (template as any).features
                        .slice(0, 4)
                        .map((feature: any, index: number) => (
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
                    {(template as any).features &&
                      (template as any).features.length > 4 && (
                        <div className="text-xs text-gray-400 mt-2">
                          +{(template as any).features.length - 4} more features
                        </div>
                      )}
                  </div>

                  {/* Category Badge */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                      {template.is_featured && !isComingSoon && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    {isSelected && !isComingSoon && (
                      <svg
                        className="w-6 h-6 text-green-400"
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
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!selectedTemplate}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateStep;
