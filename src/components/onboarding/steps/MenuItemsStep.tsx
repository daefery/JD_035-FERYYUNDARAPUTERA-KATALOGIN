/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { OnboardingStepProps } from "../../../types/onboarding";

const MenuItemsStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
  setShowMenuItemModal,
}) => {
  const removeMenuItem = (id: string) => {
    const updatedMenuItems = data.menuItems.filter((item) => item.id !== id);
    onNext({ menuItems: updatedMenuItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ menuItems: data.menuItems });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Menu Items</h3>

          {/* Add menu item button */}
          <button
            type="button"
            onClick={() => setShowMenuItemModal?.(true)}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
          >
            + Add Menu Item
          </button>
        </div>

        {/* Menu items list */}
        {data.menuItems.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-3">Your Menu Items:</h4>
            <div className="space-y-3">
              {data.menuItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex gap-4 items-start">
                    {/* Item Image */}
                    {item.image_url && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          width={100}
                          height={100}
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <span className="text-green-400 font-medium">
                          Rp. {Number(item.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-300 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                        {item.is_featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {item.category_name && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

export default MenuItemsStep;
