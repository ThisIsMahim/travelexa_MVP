/**
 * Translation Service
 * Handles API calls for dynamic translation loading and management
 * Ready for backend integration
 */

import { Language } from '@/context/LanguageContext';

// Configure your API base URL here
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface TranslationResponse {
  language: Language;
  translations: Record<string, string>;
  version?: string;
  lastUpdated?: string;
}

interface UserLanguagePreference {
  userId: string;
  language: Language;
  updatedAt: string;
}

/**
 * Fetch translations from backend for a specific language
 * @param language - Language code (e.g., 'en', 'bn')
 * @returns Promise with translations
 */
export const fetchTranslations = async (
  language: Language
): Promise<TranslationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/${language}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
};

/**
 * Fetch user's language preference from backend
 * @param userId - User ID
 * @returns Promise with user's language preference
 */
export const fetchUserLanguagePreference = async (
  userId: string
): Promise<UserLanguagePreference> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/language`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user language: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user language preference:', error);
    throw error;
  }
};

/**
 * Save user's language preference to backend
 * @param userId - User ID
 * @param language - Selected language
 * @returns Promise with updated preference
 */
export const saveUserLanguagePreference = async (
  userId: string,
  language: Language
): Promise<UserLanguagePreference> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });
    if (!response.ok) {
      throw new Error(`Failed to save language preference: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving language preference:', error);
    throw error;
  }
};

/**
 * Get all available languages from backend
 * @returns Promise with list of available languages
 */
export const fetchAvailableLanguages = async (): Promise<Language[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`);
    }
    const data = await response.json();
    return data.languages;
  } catch (error) {
    console.error('Error fetching available languages:', error);
    throw error;
  }
};

/**
 * Get translation statistics (useful for admin dashboard)
 * @returns Promise with translation stats
 */
export const fetchTranslationStats = async (): Promise<{
  totalKeys: number;
  languages: Record<Language, { translated: number; pending: number }>;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching translation stats:', error);
    throw error;
  }
};

/**
 * Update a single translation key (admin only)
 * @param language - Language code
 * @param key - Translation key
 * @param value - New translation value
 * @returns Promise with updated translation
 */
export const updateTranslation = async (
  language: Language,
  key: string,
  value: string
): Promise<{ key: string; value: string; language: Language }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/${language}/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update translation: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating translation:', error);
    throw error;
  }
};

/**
 * Bulk update translations (admin only)
 * @param language - Language code
 * @param translations - Object with key-value pairs
 * @returns Promise with update result
 */
export const bulkUpdateTranslations = async (
  language: Language,
  translations: Record<string, string>
): Promise<{ updated: number; language: Language }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translations/${language}/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ translations }),
    });
    if (!response.ok) {
      throw new Error(`Failed to bulk update translations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error bulk updating translations:', error);
    throw error;
  }
};

export default {
  fetchTranslations,
  fetchUserLanguagePreference,
  saveUserLanguagePreference,
  fetchAvailableLanguages,
  fetchTranslationStats,
  updateTranslation,
  bulkUpdateTranslations,
};
