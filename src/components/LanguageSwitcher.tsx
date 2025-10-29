import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const flagUrl = language === 'en' 
    ? 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.14.0/flags/4x3/us.svg'
    : 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.14.0/flags/4x3/bd.svg';

  return (
    <button
      onClick={handleLanguageToggle}
      className="w-7 h-7 rounded-full overflow-hidden bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110"
      aria-label="Toggle language"
    >
      <img 
        src={flagUrl} 
        alt={language === 'en' ? 'English' : 'Bengali'}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

export default LanguageSwitcher;
