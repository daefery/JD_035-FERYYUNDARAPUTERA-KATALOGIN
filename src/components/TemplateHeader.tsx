import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "./Modal";

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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Stores
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
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
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                WhatsApp
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter/X
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
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
