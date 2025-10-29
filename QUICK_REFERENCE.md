# Quick Reference Guide - Multilingual System

## Using Translations in Components

### Basic Usage
```tsx
import { useLanguage } from '@/context/LanguageContext';

export const MyComponent = () => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('section.key')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
};
```

### Switching Language
```tsx
const { setLanguage } = useLanguage();

<button onClick={() => setLanguage('bn')}>বাংলা</button>
<button onClick={() => setLanguage('en')}>English</button>
```

## Adding New Translations

1. **Edit** `src/locales/translations.ts`
2. **Add key** to both `en` and `bn` objects:
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
3. **Use in component:**
```tsx
{t('mySection.myKey')}
```

## Common Translation Keys

| Key | English | Bangla |
|-----|---------|--------|
| `nav.home` | Home | হোম |
| `nav.flights` | Flights | ফ্লাইট |
| `nav.hotels` | Hotels | হোটেল |
| `nav.tours` | Tours | ট্যুর |
| `nav.contact` | Contact | যোগাযোগ |
| `hero.title` | Explore the World with TravelExa | TravelExa এর সাথে বিশ্ব অন্বেষণ করুন |
| `hero.cta` | Start Your Journey | আপনার যাত্রা শুরু করুন |
| `hotel.bookNow` | Book Now | এখনই বুক করুন |
| `contact.send` | Send Message | বার্তা পাঠান |

## Advanced Usage

### Get All Translations for a Section
```tsx
import { useTranslations } from '@/hooks/useTranslations';

const { getSection } = useTranslations();
const navTranslations = getSection('nav');
```

### Check if Key Exists
```tsx
const { hasKey } = useTranslations();

if (hasKey('custom.key')) {
  // Use it
}
```

### Use Fallback
```tsx
const { getWithFallback } = useTranslations();

const text = getWithFallback('missing.key', 'Default text');
```

## API Integration

### Fetch Translations from Backend
```tsx
import translationService from '@/services/translationService';

const translations = await translationService.fetchTranslations('en');
```

### Save User Language Preference
```tsx
await translationService.saveUserLanguagePreference(userId, 'bn');
```

### Update Single Translation (Admin)
```tsx
await translationService.updateTranslation('en', 'nav.home', 'New Home Text');
```

## File Locations

| File | Purpose |
|------|---------|
| `src/context/LanguageContext.tsx` | Language state management |
| `src/components/LanguageSwitcher.tsx` | Language selector UI |
| `src/locales/translations.ts` | All translation strings |
| `src/hooks/useTranslations.ts` | Enhanced translation utilities |
| `src/services/translationService.ts` | API integration |

## Language Codes

- `en` - English
- `bn` - Bangla (Bengali)

## Storage

Language preference is stored in `localStorage` with key: `language`

```javascript
// Get current language
const lang = localStorage.getItem('language');

// Set language
localStorage.setItem('language', 'bn');
```

## Debugging

### Check Current Language
```tsx
const { language } = useLanguage();
console.log('Current language:', language);
```

### Check Available Translations
```tsx
const { getAllTranslations } = useTranslations();
console.log(getAllTranslations());
```

### Verify Key Exists
```tsx
const { hasKey } = useTranslations();
console.log(hasKey('nav.home')); // true or false
```

## Best Practices

✅ **DO:**
- Use translation keys consistently
- Keep translations in sync between languages
- Test both languages thoroughly
- Use TypeScript for type safety
- Document new translation keys

❌ **DON'T:**
- Hardcode text in components
- Mix translation keys and hardcoded text
- Create duplicate keys
- Forget to add translations for both languages
- Ignore text length variations

## Common Issues & Solutions

### Issue: Translation shows key name instead of text
**Solution:** Check if key exists in `translations.ts` with correct spelling

### Issue: Language doesn't persist
**Solution:** Check if localStorage is enabled in browser

### Issue: Component doesn't update on language change
**Solution:** Ensure component uses `useLanguage()` hook

### Issue: TypeScript error on translation key
**Solution:** Make sure key is exported in `translations.ts`

## Performance Tips

- Translations are loaded once on app initialization
- Language switching is instant (no API calls)
- localStorage caching for persistence
- Suitable for 1000+ translation keys
- Ready for lazy loading with backend

## Accessibility

- HTML `lang` attribute automatically set
- Screen reader compatible
- SEO friendly
- WCAG 2.1 compliant

## Example: Complete Component

```tsx
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export const BookingForm = () => {
  const { t, language } = useLanguage();

  return (
    <div>
      <h2>{t('flight.title')}</h2>
      <input placeholder={t('flight.from')} />
      <input placeholder={t('flight.to')} />
      <Button>{t('flight.search')}</Button>
      
      <p>Language: {language}</p>
    </div>
  );
};
```

## Support

For detailed documentation, see:
- `TRANSLATION_SYSTEM.md` - Complete system guide
- `LANGUAGE_SETUP_GUIDE.md` - Setup instructions
- `COMPONENTS_UPDATED.md` - List of updated components
