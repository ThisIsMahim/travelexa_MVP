# Translation System Documentation

## Quick Start

### 1. Use translations in any component:
```tsx
import { useLanguage } from '@/context/LanguageContext';

export const MyComponent = () => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
};
```

### 2. Add new translations:
Edit `src/locales/translations.ts`:
```typescript
export const translations = {
  en: {
    'mySection.myKey': 'English text',
  },
  bn: {
    'mySection.myKey': 'বাংলা পাঠ',
  },
};
```

### 3. Use language switcher:
Already integrated in Navigation component. Users can switch languages via dropdown.

---

## File Structure

```
src/
├── context/
│   └── LanguageContext.tsx          # Language state management
├── components/
│   └── LanguageSwitcher.tsx         # Language selection UI
├── hooks/
│   └── useTranslations.ts           # Enhanced translation utilities
├── locales/
│   └── translations.ts              # All translation strings
├── services/
│   └── translationService.ts        # API integration ready
└── App.tsx                          # Wrapped with LanguageProvider
```

---

## Core Components

### LanguageContext
Manages:
- Current language state
- Language persistence (localStorage)
- Translation function
- HTML lang attribute

```tsx
const { language, setLanguage, t } = useLanguage();
```

### LanguageSwitcher
- Dropdown UI component
- Integrated in Navigation
- Supports English and Bangla

### Translations File
- Centralized text management
- Organized by sections
- Both languages in one file
- Easy to maintain

---

## Advanced Usage

### Using useTranslations Hook
```tsx
import { useTranslations } from '@/hooks/useTranslations';

export const AdvancedComponent = () => {
  const { t, getSection, hasKey, getWithFallback } = useTranslations();
  
  // Get all nav translations
  const navTranslations = getSection('nav');
  
  // Check if key exists
  if (hasKey('custom.key')) {
    // Use it
  }
  
  // Use fallback
  const text = getWithFallback('missing.key', 'Default text');
  
  return <div>{text}</div>;
};
```

### Translation Service (API Ready)
```tsx
import translationService from '@/services/translationService';

// Fetch translations from backend
const translations = await translationService.fetchTranslations('en');

// Save user language preference
await translationService.saveUserLanguagePreference(userId, 'bn');

// Get available languages
const languages = await translationService.fetchAvailableLanguages();
```

---

## Backend Integration Guide

### Option 1: Dynamic Translation Loading

Update `LanguageContext.tsx`:

```tsx
const [translations, setTranslations] = useState<Record<string, any>>({});
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  translationService
    .fetchTranslations(language)
    .then(data => setTranslations(data.translations))
    .catch(err => console.error('Failed to load translations:', err))
    .finally(() => setLoading(false));
}, [language]);

const t = (key: string): string => {
  return translations[key] || key;
};
```

### Option 2: User Language Preference

```tsx
useEffect(() => {
  if (userId) {
    translationService
      .fetchUserLanguagePreference(userId)
      .then(pref => setLanguage(pref.language))
      .catch(err => console.error('Failed to load preference:', err));
  }
}, [userId]);

const handleLanguageChange = (lang: Language) => {
  setLanguage(lang);
  if (userId) {
    translationService.saveUserLanguagePreference(userId, lang);
  }
};
```

### Option 3: Admin Translation Management

```tsx
// Update a single translation
await translationService.updateTranslation('en', 'nav.home', 'New Home Text');

// Bulk update
await translationService.bulkUpdateTranslations('en', {
  'nav.home': 'Home',
  'nav.flights': 'Flights',
});

// Get stats
const stats = await translationService.fetchTranslationStats();
```

---

## API Endpoints Reference

Your backend should implement these endpoints:

### GET `/api/translations/:language`
Returns all translations for a language
```json
{
  "language": "en",
  "translations": {
    "nav.home": "Home",
    "nav.flights": "Flights"
  },
  "version": "1.0.0",
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### GET `/api/users/:userId/language`
Returns user's language preference
```json
{
  "userId": "123",
  "language": "en",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PUT `/api/users/:userId/language`
Updates user's language preference
```json
{
  "language": "bn"
}
```

### GET `/api/languages`
Returns available languages
```json
{
  "languages": ["en", "bn", "es"]
}
```

### GET `/api/translations/stats`
Returns translation statistics
```json
{
  "totalKeys": 150,
  "languages": {
    "en": { "translated": 150, "pending": 0 },
    "bn": { "translated": 145, "pending": 5 }
  }
}
```

### PUT `/api/translations/:language/:key`
Updates a single translation (admin)
```json
{
  "value": "New translation text"
}
```

### PUT `/api/translations/:language/bulk`
Bulk updates translations (admin)
```json
{
  "translations": {
    "nav.home": "Home",
    "nav.flights": "Flights"
  }
}
```

---

## Translation Keys Reference

### Navigation (`nav.*`)
- `nav.home` - Home link
- `nav.flights` - Flights link
- `nav.hotels` - Hotels link
- `nav.tours` - Tours link
- `nav.contact` - Contact link
- `nav.language` - Language selector

### Hero Section (`hero.*`)
- `hero.title` - Main title
- `hero.subtitle` - Subtitle
- `hero.cta` - Call-to-action button
- `hero.searchPlaceholder` - Search input placeholder

### Flight Booking (`flight.*`)
- `flight.title` - Section title
- `flight.from` - From field
- `flight.to` - To field
- `flight.departDate` - Departure date field
- `flight.returnDate` - Return date field
- `flight.passengers` - Passengers field
- `flight.search` - Search button
- `flight.oneWay` - One way option
- `flight.roundTrip` - Round trip option

### Hotels (`hotel.*`)
- `hotel.title` - Section title
- `hotel.subtitle` - Subtitle
- `hotel.viewDetails` - View details button
- `hotel.bookNow` - Book now button
- `hotel.pricePerNight` - Price label
- `hotel.rating` - Rating label

### Tours (`tour.*`)
- `tour.title` - Section title
- `tour.subtitle` - Subtitle
- `tour.duration` - Duration field
- `tour.price` - Price field
- `tour.viewPackage` - View package button
- `tour.days` - Days unit

### Why Choose Us (`why.*`)
- `why.title` - Section title
- `why.bestPrice` - Best price heading
- `why.bestPriceDesc` - Best price description
- `why.support` - Support heading
- `why.supportDesc` - Support description
- `why.experience` - Experience heading
- `why.experienceDesc` - Experience description
- `why.security` - Security heading
- `why.securityDesc` - Security description

### Testimonials (`testimonial.*`)
- `testimonial.title` - Section title
- `testimonial.subtitle` - Subtitle

### Contact (`contact.*`)
- `contact.title` - Section title
- `contact.subtitle` - Subtitle
- `contact.name` - Name field
- `contact.email` - Email field
- `contact.phone` - Phone field
- `contact.message` - Message field
- `contact.send` - Send button
- `contact.address` - Address label
- `contact.phone_label` - Phone label
- `contact.email_label` - Email label

### Footer (`footer.*`)
- `footer.about` - About heading
- `footer.aboutDesc` - About description
- `footer.quickLinks` - Quick links heading
- `footer.company` - Company heading
- `footer.support` - Support heading
- `footer.legal` - Legal heading
- `footer.privacy` - Privacy policy link
- `footer.terms` - Terms of service link
- `footer.copyright` - Copyright text

### Common (`common.*`)
- `common.loading` - Loading text
- `common.error` - Error message
- `common.success` - Success message
- `common.cancel` - Cancel button
- `common.submit` - Submit button
- `common.close` - Close button

---

## Best Practices

### ✅ DO
- Use translation keys consistently
- Organize keys by section
- Keep translations in sync between languages
- Test both languages thoroughly
- Use TypeScript for type safety
- Document new translation keys
- Consider text length variations

### ❌ DON'T
- Hardcode text in components
- Mix translation keys and hardcoded text
- Create duplicate keys
- Use unclear key names
- Forget to add translations for both languages
- Ignore RTL considerations for future languages

---

## Troubleshooting

### Issue: Translation key shows as key name
**Solution:** Check if key exists in `translations.ts` and spelling matches exactly

### Issue: Language doesn't persist
**Solution:** Check if localStorage is enabled in browser settings

### Issue: Component doesn't update on language change
**Solution:** Ensure component uses `useLanguage` hook and is wrapped with `LanguageProvider`

### Issue: TypeScript errors on translation keys
**Solution:** Make sure key is exported in `translations.ts` and matches the type

---

## Performance Considerations

- Translations are loaded once on app initialization
- Language preference is cached in localStorage
- No re-renders unless language actually changes
- Suitable for large translation sets
- Ready for lazy loading with backend integration

---

## Accessibility

- HTML `lang` attribute automatically set
- Helps screen readers
- Improves SEO
- Supports future RTL languages
- WCAG 2.1 compliant

---

## Future Enhancements

- [ ] Admin translation management UI
- [ ] Translation versioning
- [ ] A/B testing different translations
- [ ] Translation analytics
- [ ] Automated translation suggestions
- [ ] Translation memory
- [ ] Pluralization support
- [ ] Date/number formatting per language
- [ ] RTL language support
- [ ] Translation caching strategy

---

## Support

For questions or issues, refer to:
1. `LANGUAGE_SETUP_GUIDE.md` - Setup and basic usage
2. Component examples in existing components
3. `translationService.ts` - API integration examples
4. TypeScript type definitions in `LanguageContext.tsx`
