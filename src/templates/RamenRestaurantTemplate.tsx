import DownloadMenu from "@/components/DownloadMenu";
import {
  EmailIcon,
  ImageIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";
import { Category, MenuItem, Store } from "@/types/database";
import Image from "next/image";
import React from "react";

interface RamenRestaurantTemplateProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
}

const RamenRestaurantTemplate: React.FC<RamenRestaurantTemplateProps> = ({
  store,
  categories,
  menuItems,
}) => {
  // Group menu items by category
  const menuByCategory = categories.map((category) => ({
    ...category,
    items: menuItems.filter((item) => item.category_id === category.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-12">
            {/* Store Name */}
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-gray-300 text-lg md:text-xl max-w-md">
                  {store.description}
                </p>
              )}
            </div>

            {/* Store Logo */}
            {store.logo_url && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-lg">
                <Image
                  src={store.logo_url}
                  alt={store.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* PDF Download Section */}
          <DownloadMenu
            store={store}
            categories={categories}
            menuItems={menuItems}
            variant="premium"
          />

          {/* Menu Sections */}
          <div className="space-y-16">
            {menuByCategory.map((category) => (
              <div key={category.id} className="space-y-8">
                {/* Category Header */}
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-gray-300 text-lg">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                    >
                      {/* Item Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Item Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
                            ${item.price.toLocaleString()}
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {/* Availability Badge */}
                        <div className="mt-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-20 pt-12 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Email */}
              {store.email && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <EmailIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{store.email}</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {store.phone && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">{store.phone}</p>
                  </div>
                </div>
              )}

              {/* Address */}
              {store.address && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <LocationIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-medium">{store.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamenRestaurantTemplate;
