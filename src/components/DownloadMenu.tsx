import { DownloadIcon, SparklesIcon } from "@/components/icons";
import { Category, MenuItem, Store } from "@/types/database";
import { useTranslation } from "react-i18next";
import StorePDFDownload from "./StorePDFDownload";

interface DownloadMenuProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
  className?: string;
  title?: string;
  description?: string;
  variant?: "default" | "minimal" | "gradient" | "premium" | "elegant";
}

export default function DownloadMenu({
  store,
  categories,
  menuItems,
  className = "",
  title,
  description,
  variant = "premium",
}: DownloadMenuProps) {
  const { t } = useTranslation();

  // Use provided title/description or fall back to translations
  const displayTitle = title || t("downloadMenu.title");
  const displayDescription = description || t("downloadMenu.description");
  const variants = {
    default: {
      container: "relative group",
      content:
        "relative bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-xl rounded-2xl p-4 border border-red-500/30 shadow-xl overflow-hidden",
      title: "text-lg font-bold text-white mb-1",
      description: "text-gray-300 text-xs max-w-sm",
      buttonWrapper: "relative",
      decorative:
        "absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl",
    },
    minimal: {
      container: "relative group",
      content:
        "relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl overflow-hidden",
      title: "text-lg font-bold text-white mb-1",
      description: "text-gray-300 text-xs max-w-sm",
      buttonWrapper: "relative",
      decorative:
        "absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl",
    },
    gradient: {
      container: "relative group",
      content:
        "relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30 shadow-xl overflow-hidden",
      title: "text-lg font-bold text-white mb-1",
      description: "text-gray-300 text-xs max-w-sm",
      buttonWrapper: "relative",
      decorative:
        "absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl",
    },
    premium: {
      container: "relative group",
      content:
        "relative bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30 shadow-xl overflow-hidden",
      title: "text-lg font-bold text-white mb-1",
      description: "text-gray-300 text-xs max-w-sm",
      buttonWrapper: "relative",
      decorative:
        "absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl",
    },
    elegant: {
      container: "relative group",
      content:
        "relative bg-gradient-to-br from-slate-800/40 to-gray-900/40 backdrop-blur-xl rounded-2xl p-4 border border-slate-600/30 shadow-xl overflow-hidden",
      title: "text-lg font-bold text-white mb-1",
      description: "text-gray-300 text-xs max-w-sm",
      buttonWrapper: "relative",
      decorative:
        "absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-700/10 rounded-2xl",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className={`mb-8 text-center ${className}`}>
      <div className={currentVariant.container}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-2 left-3 w-10 h-10 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg animate-pulse delay-500"></div>
          <div className="absolute bottom-3 right-2 w-4 h-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-lg animate-pulse delay-1500"></div>
        </div>

        {/* Main Content */}
        <div className={currentVariant.content}>
          {/* Decorative Overlay */}
          <div className={currentVariant.decorative}></div>

          {/* Content - Mobile: Vertical, Desktop: Horizontal */}
          <div className="relative z-10 md:flex md:items-center md:justify-between">
            {/* Left Side - Icon and Text */}
            <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-3 mb-4 md:mb-0">
              {/* Icon */}
              <div className="relative mb-3 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DownloadIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-2 h-2 text-white" />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left">
                <h3 className={currentVariant.title}>{displayTitle}</h3>
                <p className={currentVariant.description}>
                  {displayDescription}
                </p>
              </div>
            </div>

            {/* Right Side - Download Button */}
            <div className={currentVariant.buttonWrapper}>
              <div className="relative group/button">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-lg group-hover/button:blur-xl transition-all duration-300"></div>
                <div className="relative">
                  <StorePDFDownload
                    store={store}
                    categories={categories}
                    menuItems={menuItems}
                    variant={variant}
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Border */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"></div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
}
