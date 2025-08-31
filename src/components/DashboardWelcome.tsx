import { PlusIcon, RocketIcon } from "@/components/icons";
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
      <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <RocketIcon className="w-16 h-16 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome to Katalogin!
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Create your first digital catalog and start showcasing your products
            to customers online. It only takes a few minutes to set up!
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
          >
            Create Your First Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Welcome back, {user?.user_metadata?.firstName || "User"}!
          </h2>
          <p className="text-gray-300">
            You have {storeCount} store{storeCount !== 1 ? "s" : ""} in your
            account.
          </p>
        </div>
        <Link
          href="/dashboard/stores/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Store
        </Link>
      </div>
    </div>
  );
}
