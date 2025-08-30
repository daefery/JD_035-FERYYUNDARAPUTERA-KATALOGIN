import { Category, MenuItem, Store } from "@/types/database";
import Image from "next/image";
import React from "react";

interface DefaultTemplateProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
}

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {store.logo_url && (
              <div className="flex-shrink-0">
                <Image
                  src={store.logo_url}
                  alt={`${store.name} logo`}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover w-[120px] h-[120px]"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-gray-300 text-lg mb-4">
                  {store.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {store.address && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">📍</span>
                    {store.address}
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">📞</span>
                    {store.phone}
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">✉️</span>
                    {store.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Store Banner */}
        {store.banner_url && (
          <div className="mb-8">
            <Image
              src={store.banner_url}
              alt={`${store.name} banner`}
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
              width={1200}
              height={400}
            />
          </div>
        )}

        {/* Menu Sections */}
        {menuByCategory.length > 0 ? (
          <div className="space-y-8">
            {menuByCategory.map((category) => (
              <div
                key={category.id}
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-300 mb-6">{category.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 hover:bg-opacity-30 transition-all duration-300"
                    >
                      {item.image_url && (
                        <div className="mb-4">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {item.name}
                        </h3>
                        <span className="text-yellow-400 font-bold">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-gray-300 text-sm mb-3">
                          {item.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
            <div className="text-center text-gray-300">
              <p>No menu items available yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultTemplate;
