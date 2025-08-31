import { DownloadIcon } from "@/components/icons";

interface QuickDownloadButtonProps {
  targetId?: string;
  className?: string;
  variant?: "default" | "minimal" | "gradient" | "premium" | "elegant";
}

export default function QuickDownloadButton({
  targetId = "download-section",
  className = "",
  variant = "elegant",
}: QuickDownloadButtonProps) {
  const handleClick = () => {
    const downloadSection = document.getElementById(targetId);
    if (downloadSection) {
      downloadSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const variants = {
    default: {
      glow: "bg-gradient-to-r from-red-400/30 to-red-500/30",
      bg: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
      pulse: "bg-gradient-to-r from-red-400/20 to-red-500/20",
    },
    minimal: {
      glow: "bg-gradient-to-r from-gray-400/30 to-gray-500/30",
      bg: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
      pulse: "bg-gradient-to-r from-gray-400/20 to-gray-500/20",
    },
    gradient: {
      glow: "bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-500/30",
      bg: "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800",
      pulse:
        "bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-500/20",
    },
    premium: {
      glow: "bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-red-400/30",
      bg: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700",
      pulse:
        "bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20",
    },
    elegant: {
      glow: "bg-gradient-to-r from-slate-400/30 via-gray-400/30 to-slate-500/30",
      bg: "bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800",
      pulse:
        "bg-gradient-to-r from-slate-400/20 via-gray-400/20 to-slate-500/20",
    },
  };

  const currentVariant = variants[variant];

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-25 right-8 z-50 group ${className}`}
      aria-label="Quick access to download menu PDF"
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 ${currentVariant.glow} rounded-full blur-lg group-hover:blur-xl transition-all duration-300`}
      ></div>

      {/* Button */}
      <div
        className={`relative w-13 h-13 ${currentVariant.bg} rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border border-white/20`}
      >
        <DownloadIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />

        {/* Pulse Animation */}
        <div
          className={`absolute inset-0 rounded-full ${currentVariant.pulse} animate-ping`}
        ></div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Download Menu PDF
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
      </div>
    </button>
  );
}
