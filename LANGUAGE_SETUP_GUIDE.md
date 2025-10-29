# Multilingual Language System Setup Guide

## Overview

This project now supports multiple languages (English and Bangla) with a centralized translation system. The language context and switcher component make it easy to manage translations and allow users to switch languages seamlessly.

## Architecture

### 1. **LanguageContext** (`src/context/LanguageContext.tsx`)
- Manages the current language state
- Persists language preference to localStorage
- Provides translation function `t(key)`
- Sets HTML lang attribute for accessibility

### 2. **Translations File** (`src/locales/translations.ts`)
- Centralized location for all text content
- Organized by sections (nav, hero, flight, hotel, tour, why, testimonial, contact, footer, common)
- Supports both English and Bangla
- Easy to add new languages

### 3. **LanguageSwitcher Component** (`src/components/LanguageSwitcher.tsx`)
- Dropdown UI for switching between languages
- Uses Radix UI Select component
- Integrated into Navigation component

## How to Use

### Step 1: Wrap Your App with LanguageProvider

The `App.tsx` is already wrapped with `LanguageProvider`. Make sure it's at the top level:

```tsx
import { LanguageProvider } from "@/context/LanguageContext";

const App = () => (
  <LanguageProvider>
    {/* Your app components */}
  </LanguageProvider>
);
```

### Step 2: Use the useLanguage Hook in Components

```tsx
import { useLanguage } from '@/context/LanguageContext';

const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button onClick={() => setLanguage('bn')}>Switch to Bangla</button>
    </div>
  );
};
```

### Step 3: Add Translations

Edit `src/locales/translations.ts` to add new translation keys:

```typescript
export const translations = {
  en: {
    'section.key': 'English text here',
    // ...
  },
  bn: {
    'section.key': 'বাংলা পাঠ এখানে',
    // ...
  },
};
```

## Translation Key Naming Convention

Use dot notation for organization:
- `nav.*` - Navigation items
- `hero.*` - Hero section
- `flight.*` - Flight booking section
- `hotel.*` - Hotel section
- `tour.*` - Tour packages section
- `why.*` - Why choose us section
- `testimonial.*` - Testimonials section
- `contact.*` - Contact section
- `footer.*` - Footer section
- `common.*` - Common/reusable text

## Example: Updating a Component

### Before (Hardcoded Text)
```tsx
const Hero = () => {
  return (
    <div>
      <h1>Explore the World with TravelExa</h1>
      <p>Discover amazing destinations</p>
    </div>
  );
};
```

### After (With Translations)
```tsx
import { useLanguage } from '@/context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
};
```

## Adding a New Language

1. Add language type to `LanguageContext.tsx`:
```tsx
export type Language = 'en' | 'bn' | 'es'; // Add 'es' for Spanish
```

2. Add translations to `translations.ts`:
```typescript
export const translations = {
  en: { /* ... */ },
  bn: { /* ... */ },
  es: {
    'nav.home': 'Inicio',
    'nav.flights': 'Vuelos',
    // ... add all keys
  },
};
```

3. Update `LanguageSwitcher.tsx`:
```tsx
<SelectContent>
  <SelectItem value="en">English</SelectItem>
  <SelectItem value="bn">বাংলা</SelectItem>
  <SelectItem value="es">Español</SelectItem>
</SelectContent>
```

## Backend Integration

The system is designed to support backend/API integration:

### Option 1: Fetch Translations from API

Update `LanguageContext.tsx`:

```tsx
const [translations, setTranslations] = useState({});

useEffect(() => {
  // Fetch translations from your backend
  fetch(`/api/translations/${language}`)
    .then(res => res.json())
    .then(data => setTranslations(data));
}, [language]);

const t = (key: string): string => {
  return translations[key] || key;
};
```

### Option 2: Fetch User Language Preference from API

```tsx
useEffect(() => {
  // Fetch user's language preference from backend
  fetch('/api/user/preferences')
    .then(res => res.json())
    .then(data => setLanguageState(data.language));
}, []);
```

## Best Practices

1. **Always use translation keys** - Never hardcode text in components
2. **Organize translations logically** - Use clear section prefixes
3. **Keep translations in sync** - Ensure both languages have the same keys
4. **Use descriptive key names** - Make keys self-documenting
5. **Test both languages** - Verify layout works with different text lengths
6. **Consider text direction** - Some languages may need RTL support

## TypeScript Support

The translation function is fully typed:

```tsx
const { t } = useLanguage();
// TypeScript will autocomplete available keys
t('nav.home') // ✅ Valid
t('invalid.key') // ❌ TypeScript error
```

## Persistence

- Language preference is automatically saved to localStorage
- Persists across browser sessions
- Automatically restored on page reload

## Accessibility

- HTML `lang` attribute is automatically set based on current language
- Helps screen readers and search engines
- Improves SEO for multilingual content

## Current Translations

The system includes translations for:
- Navigation
- Hero section
- Flight booking
- Hotel showcase
- Tour packages
- Why choose us section
- Testimonials
- Contact form
- Footer
- Common UI elements

## Next Steps

1. Update all components to use the `useLanguage` hook
2. Add more translation keys as needed
3. Implement backend API integration for dynamic translations
4. Add more languages as required
5. Consider implementing translation management UI for admins

## Troubleshooting

### Translation key not showing
- Check if key exists in `translations.ts`
- Verify key spelling matches exactly
- Check browser console for errors

### Language not persisting
- Check if localStorage is enabled
- Clear browser cache and try again
- Check browser DevTools > Application > Storage

### Component not re-rendering on language change
- Ensure component uses `useLanguage` hook
- Check if component is wrapped with `LanguageProvider`
- Verify no memoization is preventing re-renders

## Support for Future Enhancements

The system is built to support:
- ✅ Multiple languages
- ✅ Centralized text management
- ✅ User language preference persistence
- ✅ Backend API integration
- ✅ Dynamic translation loading
- ✅ Admin translation management
- ✅ Translation versioning
- ✅ A/B testing different translations
