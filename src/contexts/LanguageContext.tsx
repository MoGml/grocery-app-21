import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(i18n.language || 'en');
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  const setLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    setIsRTL(lang === 'ar');

    // Update document direction and lang attribute
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Store in localStorage
    localStorage.setItem('language', lang);
  }, [i18n]);

  useEffect(() => {
    // Check for stored language preference
    const storedLang = localStorage.getItem('language');
    if (storedLang && (storedLang === 'en' || storedLang === 'ar')) {
      setLanguage(storedLang);
    } else {
      // Set initial direction based on current language
      setLanguage(i18n.language);
    }
  }, [i18n.language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
