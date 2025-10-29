import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/locales/translations';

/**
 * Enhanced hook for translations with additional utilities
 * Useful for complex translation scenarios and API integration
 */
export const useTranslations = () => {
  const { language, setLanguage, t } = useLanguage();

  /**
   * Get all translations for current language
   */
  const getAllTranslations = () => {
    return translations[language];
  };

  /**
   * Get translations for a specific section
   * @example getSection('nav') returns all nav.* translations
   */
  const getSection = (section: string) => {
    const allTranslations = getAllTranslations();
    return Object.entries(allTranslations).reduce((acc, [key, value]) => {
      if (key.startsWith(`${section}.`)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  };

  /**
   * Check if a translation key exists
   */
  const hasKey = (key: string): boolean => {
    const allTranslations = getAllTranslations();
    return key in allTranslations;
  };

  /**
   * Get translation with fallback
   * @example getWithFallback('missing.key', 'Default text')
   */
  const getWithFallback = (key: string, fallback: string): string => {
    return hasKey(key) ? t(key as any) : fallback;
  };

  /**
   * Get all available languages
   */
  const getAvailableLanguages = () => {
    return Object.keys(translations) as Array<keyof typeof translations>;
  };

  return {
    language,
    setLanguage,
    t,
    getAllTranslations,
    getSection,
    hasKey,
    getWithFallback,
    getAvailableLanguages,
  };
};

export default useTranslations;
