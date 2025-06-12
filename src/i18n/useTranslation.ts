import { useState, useEffect } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'uz' | 'ru' | 'kk' | 'ky' | 'tg' | 'zh';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('admin-panel-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('admin-panel-language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  uz: 'O\'zbekcha',
  ru: 'Русский',
  kk: 'Қазақша',
  ky: 'Кыргызча',
  tg: 'Тоҷикӣ',
  zh: '中文'
};