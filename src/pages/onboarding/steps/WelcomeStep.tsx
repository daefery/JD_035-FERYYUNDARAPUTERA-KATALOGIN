import { OnboardingStepProps } from "../types";

const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext }) => (
  <div className="text-center">
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-4">
        🎉 Welcome to Katalogin!
      </h1>
      <p className="text-lg text-gray-300 mb-6">
        Create a beautiful digital catalog for your business in minutes
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="p-4 md:p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-3xl mb-2">🏪</div>
          <h3 className="font-semibold mb-2 text-white">Create Store</h3>
          <p className="text-sm text-gray-300">
            Set up your store details and branding
          </p>
        </div>
        <div className="p-4 md:p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-semibold mb-2 text-white">Add Menu</h3>
          <p className="text-sm text-gray-300">
            Organize your products and services
          </p>
        </div>
        <div className="p-4 md:p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-semibold mb-2 text-white">Share & Grow</h3>
          <p className="text-sm text-gray-300">
            Get your store online and start selling
          </p>
        </div>
      </div>
    </div>
    <button
      onClick={() => onNext({})}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
    >
      Get Started
    </button>
  </div>
);

export default WelcomeStep;
