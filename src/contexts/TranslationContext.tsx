
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/translations';

// Define the available languages
export type Language = 'en' | 'fr';

// Define the translation context type
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get browser language or use English as default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
  };

  // Initialize state with browser language
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem('app_language');
    return (storedLang as Language) || getBrowserLanguage();
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return key;
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
};
