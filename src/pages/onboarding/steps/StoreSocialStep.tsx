import { useState } from "react";
import { OnboardingStepProps } from "../types";

const StoreSocialStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [socialData, setSocialData] = useState({
    facebook_url: data.store?.facebook_url || "",
    instagram_url: data.store?.instagram_url || "",
    twitter_url: data.store?.twitter_url || "",
    tiktok_url: data.store?.tiktok_url || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ store: { ...data.store, ...socialData } });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">
            Social Media Links
          </h3>
          <p className="text-gray-300 mb-6">
            Connect your social media accounts to help customers find you online
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label
                htmlFor="facebook_url"
                className="block text-sm font-medium text-white mb-2"
              >
                Facebook
              </label>
              <input
                type="url"
                id="facebook_url"
                name="facebook_url"
                value={socialData.facebook_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label
                htmlFor="instagram_url"
                className="block text-sm font-medium text-white mb-2"
              >
                Instagram
              </label>
              <input
                type="url"
                id="instagram_url"
                name="instagram_url"
                value={socialData.instagram_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div>
              <label
                htmlFor="twitter_url"
                className="block text-sm font-medium text-white mb-2"
              >
                Twitter/X
              </label>
              <input
                type="url"
                id="twitter_url"
                name="twitter_url"
                value={socialData.twitter_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div>
              <label
                htmlFor="tiktok_url"
                className="block text-sm font-medium text-white mb-2"
              >
                TikTok
              </label>
              <input
                type="url"
                id="tiktok_url"
                name="tiktok_url"
                value={socialData.tiktok_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="https://tiktok.com/@yourhandle"
              />
            </div>
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSocialStep;
