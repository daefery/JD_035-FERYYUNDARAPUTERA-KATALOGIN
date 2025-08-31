import {
  KATALOGIN_DEFAULT_LANGUAGE,
  LANGUAGE_KEY_STORAGE,
} from "@/lib/constant";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobeIcon } from "./icons";

const DarkLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY_STORAGE);
    if (!stored) {
      i18n.changeLanguage(KATALOGIN_DEFAULT_LANGUAGE);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Close dropdown after language change
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
      >
        <GlobeIcon className="w-4 h-4 text-white" />
        <span className="hidden sm:inline text-white">
          {i18n.language === "en" ? "English" : "Indonesia"}
        </span>
        <span className="sm:hidden text-white">
          {i18n.language === "en" ? "EN" : "ID"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform text-white ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="py-1">
          <button
            onClick={() => changeLanguage("en")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
              i18n.language === "en"
                ? "bg-purple-500/20 text-purple-300"
                : "text-white"
            }`}
          >
            <div className="flex items-center gap-2">English</div>
          </button>
          <button
            onClick={() => changeLanguage("id")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
              i18n.language === "id"
                ? "bg-purple-500/20 text-purple-300"
                : "text-white"
            }`}
          >
            <div className="flex items-center gap-2">Indonesia</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DarkLanguageSwitcher;
