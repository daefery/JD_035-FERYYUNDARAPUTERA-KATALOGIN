import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRef, useState } from "react";
import { CloudUploadIcon } from "./icons";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  bucketName: "store_data" | "gallery";
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "https://example.com/image.jpg",
  bucketName,
  folder = "",
  accept = "image/*",
  maxSize = 5, // 5MB default
}: ImageUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!user) {
      setError("You must be logged in to upload images");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Generate unique filename with timestamp to avoid cache issues
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${
        folder ? folder + "/" : ""
      }${timestamp}.${fileExtension}`;

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        onChange(urlData.publicUrl);
        setUploadProgress(100);
      } else {
        throw new Error("Failed to get public URL");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">{label}</label>

      {/* URL Input */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        placeholder={placeholder}
      />

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-white/20"></div>
        <span className="px-3 text-sm text-gray-300">OR</span>
        <div className="flex-1 border-t border-white/20"></div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isUploading
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/20 hover:border-white/40 bg-white/5"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-purple-300">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-3">
            <CloudUploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-white font-medium">Drop an image here, or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                browse files
              </button>
            </div>
            <p className="text-sm text-gray-400">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative">
          <Image
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            width={100}
            height={100}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
