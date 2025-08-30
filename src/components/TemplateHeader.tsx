import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "./Modal";
import {
  ArrowLeftIcon,
  EmailIcon,
  FacebookIcon,
  ShareIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "./icons";

interface TemplateHeaderProps {
  storeSlug: string;
  storeName: string;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  storeSlug,
  storeName,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  const handleBackToStores = () => {
    router.push("/dashboard/stores");
  };

  const handleCopyLink = async () => {
    const storeUrl = `${window.location.origin}/store/${storeSlug}`;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const handleShare = (platform: string) => {
    const storeUrl = `${window.location.origin}/store/${storeSlug}`;
    const text = `Check out ${storeName}!`;

    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${storeUrl}`
        )}`;
        break;
      case "facebook":
        // Facebook sharing with fallback - if URL doesn't work, include it in text
        const facebookText = `${text} ${storeUrl}`;
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          storeUrl
        )}&quote=${encodeURIComponent(facebookText)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(storeUrl)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          text
        )}&body=${encodeURIComponent(`Check out this store: ${storeUrl}`)}`;
        break;
    }

    if (shareUrl) {
      // Open in a new window with specific dimensions
      const popup = window.open(
        shareUrl,
        "share",
        "width=600,height=400,scrollbars=yes,resizable=yes"
      );

      // Focus the popup if it was blocked
      if (popup) {
        popup.focus();
      } else {
        // Fallback: open in same window if popup is blocked
        window.open(shareUrl, "_blank");
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToStores}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Stores
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ShareIcon className="w-4 h-4" />
              Share Store
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Store"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Store Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/store/${storeSlug}`}
                readOnly
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                disabled={copyFeedback !== ""}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
              >
                {copyFeedback || "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
                Twitter/X
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <EmailIcon className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TemplateHeader;
