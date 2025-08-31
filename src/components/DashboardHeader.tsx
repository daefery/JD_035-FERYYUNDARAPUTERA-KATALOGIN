import KataloginLogo from "@/components/KataloginLogo";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

interface DashboardHeaderProps {
  className?: string;
}

export default function DashboardHeader({
  className = "",
}: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActiveRoute = (path: string) => {
    return router.pathname === path;
  };

  return (
    <header
      className={`bg-white/5 backdrop-blur-lg border-b border-white/10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <KataloginLogo size="md" clickable={true} />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-white">
              <Link
                href="/dashboard"
                className={`hover:text-purple-300 transition-colors ${
                  isActiveRoute("/dashboard") ? "text-purple-300" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/stores"
                className={`hover:text-purple-300 transition-colors ${
                  isActiveRoute("/dashboard/stores") ? "text-purple-300" : ""
                }`}
              >
                My Stores
              </Link>
              <Link
                href="/dashboard/analytics"
                className={`hover:text-purple-300 transition-colors ${
                  isActiveRoute("/dashboard/analytics") ? "text-purple-300" : ""
                }`}
              >
                Analytics
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {/* <div className="hidden md:block text-right">
                <p className="text-white text-sm font-medium">
                  {user?.user_metadata?.firstName || user?.email?.split("@")[0]}
                </p>
                <p className="text-gray-300 text-xs">{user?.email}</p>
              </div> */}
              <div className="relative group">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm border border-white/20 hover:border-white/30"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3">
                    <p className="text-gray-700 text-sm font-medium mb-1">
                      Sign Out
                    </p>
                    <p className="text-gray-500 text-xs">
                      You&apos;ll be redirected to the home page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
