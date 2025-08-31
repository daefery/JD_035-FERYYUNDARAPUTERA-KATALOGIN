import {
  KATALOGIN_DEFAULT_LANGUAGE,
  LANGUAGE_KEY_STORAGE,
} from "@/lib/constant";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobeIcon } from "./icons";

const LanguageSwitcher: React.FC = () => {
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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">
          {i18n.language === "en" ? "English" : "Indonesia"}
        </span>
        <span className="sm:hidden">
          {i18n.language === "en" ? "EN" : "ID"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
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
        className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="py-1">
          <button
            onClick={() => changeLanguage("en")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
              i18n.language === "en"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">English</div>
          </button>
          <button
            onClick={() => changeLanguage("id")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
              i18n.language === "id"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">Indonesia</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
