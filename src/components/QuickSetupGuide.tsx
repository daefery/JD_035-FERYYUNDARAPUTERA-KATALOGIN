import Link from "next/link";
import { ChevronRightIcon } from "./icons";

interface QuickSetupGuideProps {
  storeId?: string;
}

export default function QuickSetupGuide({ storeId }: QuickSetupGuideProps) {
  const steps = [
    {
      id: 1,
      title: "Add Menu Categories",
      description: "Organize your menu items into categories",
      icon: "📂",
      href: storeId ? `/dashboard/stores/${storeId}/menu` : "/dashboard/stores",
      completed: false,
    },
    {
      id: 2,
      title: "Add Menu Items",
      description: "Add your products and services with prices",
      icon: "🍽️",
      href: storeId ? `/dashboard/stores/${storeId}/menu` : "/dashboard/stores",
      completed: false,
    },
    {
      id: 3,
      title: "Choose Template",
      description: "Select a beautiful theme for your store",
      icon: "🎨",
      href: storeId
        ? `/dashboard/stores/${storeId}/template`
        : "/dashboard/stores",
      completed: false,
    },
    {
      id: 4,
      title: "Share Your Store",
      description: "Get your store URL and share with customers",
      icon: "🔗",
      href: storeId ? `/store/${storeId}` : "/dashboard/stores",
      completed: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Setup Guide
      </h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-lg">{step.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            <div className="flex-shrink-0">
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-600 text-lg">💡</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Pro Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Complete these steps to get your store ready for customers. You
              can always come back and edit later!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
