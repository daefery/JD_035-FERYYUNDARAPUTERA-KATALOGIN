import { PartyIcon, RocketIcon } from "@/components/icons";
import { useState } from "react";
import { OnboardingStepProps } from "../../../types/onboarding";

const PreviewStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onBack,
  data,
}) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    onNext({});
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20 relative">
      {isLaunching && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white font-medium">Creating your store...</div>
            <div className="text-gray-300 text-sm">
              Please wait, this may take a few moments
            </div>
          </div>
        </div>
      )}
      <div className="text-center space-y-6">
        <div className="mb-4 flex justify-center">
          <PartyIcon className="w-16 h-16 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Ready to Launch!</h3>
        <p className="text-gray-300">
          Your store &quot;{data.store?.name}&quot; is ready to go live.
          Here&apos;s what we&apos;ve set up:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <h4 className="font-medium mb-2 text-white">Store Details</h4>
            <p className="text-sm text-gray-300">Name: {data.store?.name}</p>
            <p className="text-sm text-gray-300">
              Slug: {data.store?.slug || "auto-generated"}
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <h4 className="font-medium mb-2 text-white">Menu</h4>
            <p className="text-sm text-gray-300">
              {data.categories?.length || 0} categories
            </p>
            <p className="text-sm text-gray-300">
              {data.menuItems?.length || 0} menu items
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isLaunching}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLaunching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Store...
              </>
            ) : (
              <>
                <RocketIcon className="w-4 h-4" />
                Launch Store
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
