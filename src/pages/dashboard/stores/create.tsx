import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ParticleBackground from '@/components/ParticleBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import ImageUpload from '@/components/ImageUpload';
import MapLocationPicker from '@/components/MapLocationPicker';
import { storeService } from '@/services/storeService';

export default function CreateStorePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    banner_url: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    phone: '',
    email: '',
    website: '',
  });

  // Redirect unauthenticated users
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (field: 'logo_url' | 'banner_url') => (url: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }));
  };

  const handleAddressChange = (address: string, latitude?: number, longitude?: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude,
      longitude
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a store');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Generate unique slug if not provided
      let finalSlug = formData.slug;
      if (!finalSlug) {
        finalSlug = await storeService.generateUniqueSlug(formData.name);
      }

      const storeData = {
        ...formData,
        slug: finalSlug,
        user_id: user.id,
        is_active: true
      };

      await storeService.createStore(storeData);
      
      // Redirect to stores list
      router.push('/dashboard/stores');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create New Store</h1>
              <p className="text-gray-300">Set up your restaurant or store catalog</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Stores
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter store name"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-white mb-2">
                    URL Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">/store/</span>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full pl-20 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="store-slug"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Leave empty to auto-generate from store name</p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe your store..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={formData.logo_url}
                  onChange={handleImageChange('logo_url')}
                  label="Logo"
                  placeholder="https://example.com/logo.png"
                  bucketName="store_data"
                  folder="logos"
                  maxSize={2}
                />

                <ImageUpload
                  value={formData.banner_url}
                  onChange={handleImageChange('banner_url')}
                  label="Banner"
                  placeholder="https://example.com/banner.jpg"
                  bucketName="store_data"
                  folder="banners"
                  maxSize={5}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6">Contact Information</h3>
              
              {/* Address Section - Full Width */}
              <div className="mb-6">
                <MapLocationPicker
                  value={formData.address}
                  onChange={handleAddressChange}
                  label="Address"
                  placeholder="Enter address or drag marker on map"
                />
              </div>

              {/* Other Contact Fields - Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="contact@store.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://store.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Store...
                  </div>
                ) : (
                  'Create Store'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard/stores')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
