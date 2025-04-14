
import React from 'react';
import { useTranslation, Language } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-20 border-game-secondary text-game-text"
    >
      {language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;
