# Internationalization (i18n) Implementation

This project uses `react-i18next` for internationalization with localStorage persistence.

## Architecture

### Core Files

- **`src/lib/i18n.ts`** - Main i18n configuration
- **`src/lib/constant.ts`** - Language-related constants
- **`src/components/LanguageSwitcher.tsx`** - Language selection component
- **`src/locales/`** - Translation files directory

### Translation Files

- **`src/locales/en/common.json`** - English translations
- **`src/locales/id/common.json`** - Indonesian translations

## Features

### ✅ **No URL Changes**

- Language switching doesn't change the URL (no `/en/` or `/id/` prefixes)
- Clean URLs maintained across all pages

### ✅ **Browser Storage Persistence**

- Language preference saved in `localStorage` with key `katalogin-locale`
- Automatically restored on page refresh
- Falls back to browser language detection

### ✅ **Immediate Updates**

- Translations update immediately when switching languages
- No page reload required
- Smooth user experience

### ✅ **Fallback System**

- Falls back to English if translation key not found
- Graceful degradation for missing translations

## Usage

### Basic Translation

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("auth.login")}</h1>
      <p>{t("common.loading")}</p>
    </div>
  );
}
```

### Language Switching

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <button onClick={() => changeLanguage("id")}>Switch to Indonesian</button>
  );
}
```

### Language Switcher Component

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Adding New Translations

1. **Add to English file** (`src/locales/en/common.json`):

```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

2. **Add to Indonesian file** (`src/locales/id/common.json`):

```json
{
  "newSection": {
    "title": "Judul Baru",
    "description": "Deskripsi baru"
  }
}
```

3. **Use in component**:

```tsx
const { t } = useTranslation();
return <h1>{t("newSection.title")}</h1>;
```

## Configuration

### Constants (`src/lib/constant.ts`)

```typescript
export const LANGUAGE_KEY_STORAGE = "katalogin-locale";
export const KATALOGIN_DEFAULT_LANGUAGE = "en";
```

### i18n Setup (`src/lib/i18n.ts`)

- Initializes with localStorage value or browser language
- Automatically saves language changes to localStorage
- Supports English and Indonesian languages

## Testing

Visit `/test-lang` to test the i18n system:

- Language switching
- Translation loading
- localStorage persistence
- Browser language detection

## Migration from Custom Hook

The project was migrated from a custom `useTranslation` hook to `react-i18next`:

### Before (Custom Hook)

```tsx
import { useTranslation } from "@/hooks/useTranslation";
const { t, locale, loading, changeLanguage } = useTranslation();
```

### After (react-i18next)

```tsx
import { useTranslation } from "react-i18next";
const { t, i18n } = useTranslation();
// Access language: i18n.language
// Change language: i18n.changeLanguage('id')
```

## Benefits

1. **Industry Standard** - Uses the most popular i18n library for React
2. **Better Performance** - Optimized translation loading and caching
3. **Rich Ecosystem** - Extensive plugins and community support
4. **Type Safety** - Better TypeScript support
5. **Maintainability** - Cleaner, more maintainable code
