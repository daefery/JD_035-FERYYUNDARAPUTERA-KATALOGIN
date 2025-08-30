import { useState } from "react";
import { OnboardingStepProps } from "../types";

const StoreBasicStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [storeData, setStoreData] = useState({
    name: data.store?.name || "",
    slug: data.store?.slug || "",
    description: data.store?.description || "",
    phone: data.store?.phone || "",
    email: data.store?.email || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ store: { ...data.store, ...storeData } });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Store Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={storeData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Joe's Coffee Shop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              URL Slug
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400">
                /store/
              </span>
              <input
                type="text"
                name="slug"
                value={storeData.slug}
                onChange={handleInputChange}
                className="w-full pl-20 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="store-slug"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to auto-generate from store name
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={storeData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Tell customers about your store..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={storeData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={storeData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="contact@store.com"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreBasicStep;
