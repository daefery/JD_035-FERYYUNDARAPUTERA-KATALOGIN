import { Category, MenuItem, Store } from "@/types/database";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "./icons";

interface StorePDFDownloadProps {
  store: Store;
  categories: Category[];
  menuItems: MenuItem[];
  className?: string;
  variant?: "default" | "minimal" | "gradient" | "premium" | "elegant";
}

const StorePDFDownload: React.FC<StorePDFDownloadProps> = ({
  store,
  categories,
  menuItems,
  className = "",
  variant = "premium",
}) => {
  const { t } = useTranslation();
  const coverPageRef = useRef<HTMLDivElement>(null);
  const menuPagesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Reusable Header Component
  const MenuHeader = () => (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "15mm 20mm",
        textAlign: "center",
        color: "#ffffff",
      }}
    >
      <h1
        style={{
          fontSize: "32pt",
          fontWeight: "bold",
          marginBottom: "5mm",
          textShadow: "0 2mm 4mm rgba(0,0,0,0.3)",
        }}
      >
        {store.name} - {t("downloadMenu.menu")}
      </h1>

      {/* Contact Information */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "5mm",
          flexWrap: "wrap",
          marginTop: "8mm",
        }}
      >
        {store.phone && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3mm",
            }}
          >
            <span style={{ fontSize: "14pt" }}>📞</span>
            <span style={{ fontSize: "12pt", opacity: 0.9 }}>
              {store.phone}
            </span>
          </div>
        )}

        {store.email && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3mm",
            }}
          >
            <span style={{ fontSize: "14pt" }}>✉️</span>
            <span style={{ fontSize: "12pt", opacity: 0.9 }}>
              {store.email}
            </span>
          </div>
        )}

        {store.address && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3mm",
            }}
          >
            <span style={{ fontSize: "14pt" }}>📍</span>
            <span style={{ fontSize: "12pt", opacity: 0.9 }}>
              {store.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const generatePDF = async () => {
    if (!coverPageRef.current || !menuPagesRef.current) return;

    setIsLoading(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Generate cover page
      const coverCanvas = await html2canvas(coverPageRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff", // White background for testing
        logging: true, // Enable logging for debugging
        width: 210 * 2.83465, // A4 width in pixels (210mm * 2.83465)
        height: 297 * 2.83465, // A4 height in pixels (297mm * 2.83465)
      });

      const coverImgData = coverCanvas.toDataURL("image/png");
      const coverAspectRatio = coverCanvas.width / coverCanvas.height;
      const coverWidth = pageWidth; // Full width
      const coverHeight = coverWidth / coverAspectRatio;

      // Add cover page as the first page
      pdf.addImage(coverImgData, "PNG", 0, 0, coverWidth, coverHeight);

      // Get all menu page elements
      const menuPageElements = menuPagesRef.current.children;

      // Generate each menu page
      for (let i = 0; i < menuPageElements.length; i++) {
        // Add new page for each menu page (all menu pages go on new pages)
        pdf.addPage();

        const menuCanvas = await html2canvas(
          menuPageElements[i] as HTMLElement,
          {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff", // White background for menu pages
          }
        );

        const menuImgData = menuCanvas.toDataURL("image/png");
        const menuAspectRatio = menuCanvas.width / menuCanvas.height;
        const menuWidth = pageWidth; // Full width
        const menuHeight = menuWidth / menuAspectRatio;

        pdf.addImage(menuImgData, "PNG", 0, 0, menuWidth, menuHeight);
      }

      // Download the PDF
      pdf.save(`${store.name.replace(/\s+/g, "_")}_menu.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(t("downloadMenu.downloadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Group menu items by category
  const menuItemsByCategory = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      ...category,
      items: menuItems
        .filter((item) => item.category_id === category.id && item.is_available)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((category) => category.items.length > 0);

  // Get featured items
  const featuredItems = menuItems
    .filter((item) => item.is_featured && item.is_available)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Button variants
  const buttonVariants = {
    default: {
      bg: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      glow: "bg-gradient-to-r from-red-400/30 to-red-500/30",
    },
    minimal: {
      bg: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
      glow: "bg-gradient-to-r from-gray-400/30 to-gray-500/30",
    },
    gradient: {
      bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700",
      glow: "bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-500/30",
    },
    premium: {
      bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600",
      glow: "bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-red-400/30",
    },
    elegant: {
      bg: "bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800",
      glow: "bg-gradient-to-r from-slate-500/30 via-gray-500/30 to-slate-600/30",
    },
  };

  const currentButtonVariant = buttonVariants[variant];

  return (
    <>
      {/* Hidden elements for PDF generation */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {/* Cover Page */}
        <div
          ref={coverPageRef}
          style={{
            width: "210mm",
            height: "297mm",
            padding: "0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)",
              zIndex: 1,
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              height: "100%",
              padding: "25mm 15mm",
              textAlign: "center",
            }}
          >
            {/* Store Logo/Profile Picture */}
            {store.logo_url && (
              <div
                style={{
                  width: "60mm",
                  height: "60mm",
                  margin: "0 auto 15mm",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2mm solid rgba(255,255,255,0.3)",
                  boxShadow: "0 4mm 12mm rgba(0,0,0,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  position: "absolute",
                  top: "40mm",
                  right: "47%",
                }}
              >
                <Image
                  width={96}
                  height={96}
                  src={store.logo_url}
                  alt={store.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>
            )}

            <div
              style={{
                position: "absolute",
                top: "100mm",
                right: "27%",
                padding: "6mm 10mm",
                width: "auto",
              }}
            >
              {/* Store Name */}
              <h1
                style={{
                  fontSize: "28pt",
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: "4mm",
                  textShadow: "0 2mm 4mm rgba(0,0,0,0.4)",
                  letterSpacing: "1pt",
                  lineHeight: "1.1",
                  fontFamily: "Arial, sans-serif",
                  minWidth: "120mm",
                }}
              >
                {store.name}
              </h1>

              {/* Store Description/Tagline */}
              {store.description && (
                <p
                  style={{
                    fontSize: "14pt",
                    color: "#ffffff",
                    marginBottom: "0",
                    fontStyle: "italic",
                    textShadow: "0 1mm 2mm rgba(0,0,0,0.3)",
                    opacity: 0.95,
                    maxWidth: "120mm",
                    lineHeight: "1.3",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {store.description}
                </p>
              )}
            </div>

            {/* Contact Information Card - Positioned Top Left */}
            <div
              style={{
                position: "absolute",
                top: "150mm",
                right: "36%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: "4mm",
                padding: "6mm 10mm",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 2mm 6mm rgba(0,0,0,0.2)",
                maxWidth: "110mm",
                width: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2mm",
                  color: "#ffffff",
                }}
              >
                {store.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3mm",
                    }}
                  >
                    <span style={{ fontSize: "14pt" }}>📞</span>
                    <span style={{ fontSize: "12pt", opacity: 0.9 }}>
                      {store.phone}
                    </span>
                  </div>
                )}

                {store.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3mm",
                    }}
                  >
                    <span style={{ fontSize: "14pt" }}>✉️</span>
                    <span style={{ fontSize: "12pt", opacity: 0.9 }}>
                      {store.email}
                    </span>
                  </div>
                )}

                {store.address && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3mm",
                    }}
                  >
                    <span style={{ fontSize: "14pt" }}>📍</span>
                    <span style={{ fontSize: "12pt", opacity: 0.9 }}>
                      {store.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Pages Container */}
        <div ref={menuPagesRef}>
          {/* Featured Items Page - Always render */}
          <div
            style={{
              width: "210mm",
              height: "297mm",
              padding: "0",
              backgroundColor: "#f8fafc",
              position: "relative",
              overflow: "hidden",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Header */}
            <MenuHeader />

            {/* Featured Items Section */}
            <div style={{ padding: "20mm" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "15mm",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10mm",
                  }}
                >
                  <div
                    style={{ flex: 1, height: "1px", background: "#ef4444" }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3mm",
                      marginBottom: "10mm",
                    }}
                  >
                    <span style={{ fontSize: "20pt" }}>⭐</span>
                    <h2
                      style={{
                        fontSize: "24pt",
                        fontWeight: "bold",
                        color: "#ef4444",
                        margin: 0,
                      }}
                    >
                      Featured Items
                    </h2>
                  </div>
                  <div
                    style={{ flex: 1, height: "1px", background: "#ef4444" }}
                  ></div>
                </div>
              </div>

              {featuredItems.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8mm",
                  }}
                >
                  {featuredItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background:
                          "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
                        borderRadius: "6mm",
                        padding: "6mm",
                        border: "1px solid #fbcfe8",
                        boxShadow: "0 2mm 8mm rgba(0,0,0,0.1)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "4mm",
                          alignItems: "center",
                        }}
                      >
                        {item.image_url && (
                          <div
                            style={{
                              width: "20mm",
                              height: "20mm",
                              borderRadius: "10%",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              width={96}
                              height={96}
                              src={item.image_url}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            style={{
                              fontSize: "12pt",
                              fontWeight: "bold",
                              marginBottom: "2mm",
                              color: "#374151",
                            }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: "10pt",
                                color: "#6b7280",
                                marginBottom: "3mm",
                                lineHeight: "1.3",
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "12pt",
                              fontWeight: "bold",
                              color: "#ef4444",
                            }}
                          >
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20mm",
                    color: "#6b7280",
                    fontSize: "14pt",
                    fontStyle: "italic",
                  }}
                >
                  No featured items available
                </div>
              )}
            </div>
          </div>

          {/* Category Pages */}
          {menuItemsByCategory.map((category) => (
            <div
              key={category.id}
              style={{
                width: "210mm",
                height: "297mm",
                padding: "0",
                backgroundColor: "#f8fafc",
                position: "relative",
                overflow: "hidden",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {/* Header */}
              <MenuHeader />

              {/* Category Section */}
              <div style={{ padding: "20mm" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "15mm",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10mm",
                    }}
                  >
                    <div
                      style={{ flex: 1, height: "1px", background: "#374151" }}
                    ></div>
                    <h2
                      style={{
                        fontSize: "24pt",
                        fontWeight: "bold",
                        color: "#374151",
                        margin: 0,
                        marginBottom: "10mm",
                      }}
                    >
                      {category.name}
                    </h2>
                    <div
                      style={{ flex: 1, height: "1px", background: "#374151" }}
                    ></div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8mm",
                  }}
                >
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#ffffff",
                        borderRadius: "6mm",
                        padding: "6mm",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2mm 8mm rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "4mm",
                          alignItems: "center",
                        }}
                      >
                        {item.image_url && (
                          <div
                            style={{
                              width: "20mm",
                              height: "20mm",
                              borderRadius: "10%",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              width={96}
                              height={96}
                              src={item.image_url}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            style={{
                              fontSize: "12pt",
                              fontWeight: "bold",
                              marginBottom: "2mm",
                              color: "#374151",
                            }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: "10pt",
                                color: "#6b7280",
                                marginBottom: "3mm",
                                lineHeight: "1.3",
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "12pt",
                              fontWeight: "bold",
                              color: "#374151",
                            }}
                          >
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        disabled={isLoading}
        className={`relative group inline-flex items-center gap-3 px-6 py-3 ${currentButtonVariant.bg} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      >
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 ${currentButtonVariant.glow} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}
        ></div>

        {/* Button Content */}
        <div className="relative flex items-center gap-3">
          <div className="relative">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <DownloadIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            )}
            {!isLoading && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
            )}
          </div>
          <span className="text-sm font-medium tracking-wide">
            {isLoading
              ? t("downloadMenu.generating")
              : t("downloadMenu.downloadButton")}
          </span>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12"></div>
      </button>
    </>
  );
};

export default StorePDFDownload;
