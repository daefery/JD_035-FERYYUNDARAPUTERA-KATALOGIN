import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardWelcomeProps {
  storeCount: number;
}

export default function DashboardWelcome({
  storeCount,
}: DashboardWelcomeProps) {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user has any stores
      userService.hasStores(user.id).then((hasStores) => {
        setIsNewUser(!hasStores);
      });
    }
  }, [user]);

  if (isNewUser) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Katalogin!
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first digital catalog and start sharing your business
            with customers online.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <span className="mr-2">🚀</span>
            Create Your First Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome back, {user?.user_metadata?.firstName || "User"}!
          </h2>
          <p className="text-gray-600">
            You have {storeCount} store{storeCount !== 1 ? "s" : ""} in your
            account.
          </p>
        </div>
        <Link
          href="/dashboard/stores/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <span className="mr-2">+</span>
          Add New Store
        </Link>
      </div>
    </div>
  );
}
