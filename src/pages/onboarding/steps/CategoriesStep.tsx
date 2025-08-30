import { OnboardingStepProps } from "../types";

const CategoriesStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
  setShowCategoryModal,
}) => {
  const removeCategory = (id: string) => {
    const updatedCategories = data.categories.filter((cat) => cat.id !== id);
    onNext({ categories: updatedCategories });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ categories: data.categories });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Menu Categories
          </h3>

          {/* Add category button */}
          <button
            type="button"
            onClick={() => setShowCategoryModal?.(true)}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
          >
            + Add Category
          </button>
        </div>

        {/* Categories list */}
        {data.categories.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-3">Your Categories:</h4>
            <div className="space-y-2">
              {data.categories.map(
                (cat: { id: string; name: string; description?: string }) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20"
                  >
                    <div>
                      <p className="font-medium text-white">{cat.name}</p>
                      {cat.description && (
                        <p className="text-sm text-gray-300">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(cat.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesStep;
