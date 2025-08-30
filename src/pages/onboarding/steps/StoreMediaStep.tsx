import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { OnboardingStepProps } from "../types";

const StoreMediaStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [mediaData, setMediaData] = useState({
    logo_url: data.store?.logo_url || "",
    banner_url: data.store?.banner_url || "",
  });

  const handleImageChange =
    (field: "logo_url" | "banner_url") => (url: string) => {
      setMediaData((prev) => ({ ...prev, [field]: url }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ store: { ...data.store, ...mediaData } });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ImageUpload
            value={mediaData.logo_url}
            onChange={handleImageChange("logo_url")}
            label="Logo"
            placeholder="https://example.com/logo.png"
            bucketName="store_data"
            folder="logos"
            maxSize={2}
          />

          <ImageUpload
            value={mediaData.banner_url}
            onChange={handleImageChange("banner_url")}
            label="Banner"
            placeholder="https://example.com/banner.jpg"
            bucketName="store_data"
            folder="banners"
            maxSize={5}
          />
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

export default StoreMediaStep;
