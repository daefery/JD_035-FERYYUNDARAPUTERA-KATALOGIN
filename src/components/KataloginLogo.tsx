import Link from "next/link";

interface KataloginLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  clickable?: boolean;
  className?: string;
}

export default function KataloginLogo({
  size = "md",
  showTagline = true,
  clickable = true,
  className = "",
}: KataloginLogoProps) {
  const sizeClasses = {
    sm: {
      logo: "w-8 h-8",
      text: "text-lg",
      tagline: "text-xs",
    },
    md: {
      logo: "w-12 h-12",
      text: "text-2xl",
      tagline: "text-xs",
    },
    lg: {
      logo: "w-16 h-16",
      text: "text-3xl",
      tagline: "text-sm",
    },
  };

  const currentSize = sizeClasses[size];

  const LogoContent = () => (
    <div
      className={`flex items-center gap-3 group-hover:scale-105 transition-transform duration-200 ${className}`}
    >
      <div
        className={`${currentSize.logo} bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200`}
      >
        <span className="text-white font-bold">K</span>
      </div>
      <div className="text-left">
        <span className={`text-white font-bold ${currentSize.text}`}>
          Katalogin
        </span>
        {showTagline && (
          <div className={`text-purple-300 font-medium ${currentSize.tagline}`}>
            Digital Catalogs
          </div>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block group">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
