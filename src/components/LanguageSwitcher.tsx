
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage } = useTranslation();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };
  
  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline" 
      size="sm"
      className={`bg-game-background text-game-text hover:bg-game-primary hover:text-white text-xs md:text-sm p-1 md:p-2 h-auto ${className || ''}`}
    >
      {language === 'en' ? 'Français' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
