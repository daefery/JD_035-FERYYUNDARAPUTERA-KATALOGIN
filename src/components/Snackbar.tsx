import { useEffect, useState } from "react";
import { CheckIcon, CloseIcon, InfoIcon } from "./icons";

interface SnackbarProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  isOpen: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = "info",
  duration = 3000,
  isOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon className="w-5 h-5" />;
      case "error":
        return <CloseIcon className="w-5 h-5" />;
      case "info":
        return <InfoIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${getTypeStyles()} px-4 py-3 rounded-lg shadow-lg backdrop-blur-lg border border-white/20 flex items-center gap-3 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
