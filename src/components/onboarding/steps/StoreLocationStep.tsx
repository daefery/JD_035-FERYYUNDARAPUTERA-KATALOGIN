import MapLocationPicker from "@/components/MapLocationPicker";
import { useState } from "react";
import { OnboardingStepProps } from "../../../types/onboarding";

const StoreLocationStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [locationData, setLocationData] = useState({
    address: data.store?.address || "",
    latitude: data.store?.latitude || undefined,
    longitude: data.store?.longitude || undefined,
  });

  const handleAddressChange = (
    address: string,
    latitude?: number,
    longitude?: number
  ) => {
    setLocationData({
      address,
      latitude,
      longitude,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ store: { ...data.store, ...locationData } });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <MapLocationPicker
            value={locationData.address}
            onChange={handleAddressChange}
            label="Address"
            placeholder="Enter address or drag marker on map"
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

export default StoreLocationStep;
