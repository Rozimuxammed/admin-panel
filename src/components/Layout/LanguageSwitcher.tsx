import React, { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import {
  useTranslation,
  Language,
  languageNames,
} from "../../i18n/useTranslation";

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="hidden xs:inline sm:inline">
          {languageNames[language]}
        </span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[120px]">
            <div className="py-1">
              {Object.entries(languageNames).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    language === code
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <span className="truncate block">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
