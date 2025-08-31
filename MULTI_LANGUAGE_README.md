# Multi-Language Implementation for ModernRestaurantTemplate

## Overview

The ModernRestaurantTemplate now supports multiple languages (English and Indonesian) with a complete internationalization (i18n) implementation using `react-i18next`.

## Features Implemented

### ✅ Language Support

- **English (en)** - Default language
- **Indonesian (id)** - Secondary language

### ✅ Components Updated

- **ModernRestaurantTemplate.tsx** - Main template with full i18n support
- **DarkLanguageSwitcher.tsx** - Custom language switcher for dark theme
- **DownloadMenu.tsx** - Download menu component with i18n support
- **StorePDFDownload.tsx** - PDF download component with i18n support
- **Translation files** - Updated with template-specific translations

### ✅ Translated Elements

- Featured items section
- Welcome messages
- Availability status (Available/Unavailable)
- Social media aria labels
- WhatsApp message
- WhatsApp hover indicators
- Currency display
- Category labels
- Empty state messages
- Download menu section
- PDF generation messages
- Error messages

## Translation Keys Added

### Template-specific translations in `src/locales/en/common.json` and `src/locales/id/common.json`:

```json
{
  "template": {
    "featuredItems": "Featured Items",
    "featuredItemsDescription": "Our most popular and highly recommended dishes that customers love",
    "featured": "Featured",
    "available": "Available",
    "unavailable": "Unavailable",
    "noFeaturedItems": "No featured items yet",
    "noFeaturedItemsDescription": "Mark items as featured to showcase them here",
    "welcomeTo": "Welcome to",
    "uncategorized": "Uncategorized",
    "followUsOn": "Follow us on",
    "whatsappMessage": "Hi, I'm interested in your menu!",
    "askOnWhatsApp": "Ask on WhatsApp",
    "currency": "Rp",
    "priceFormat": "{{price}}",
    "ariaLabels": {
      "instagram": "Follow us on Instagram",
      "facebook": "Follow us on Facebook",
      "twitter": "Follow us on Twitter/X",
      "tiktok": "Follow us on TikTok"
    }
  },
  "downloadMenu": {
    "title": "Download Our Menu",
    "description": "Get a beautiful PDF version of our complete menu with all items and prices",
    "downloadButton": "Download PDF",
    "generating": "Generating PDF...",
    "downloadReady": "Download Ready!",
    "downloadFailed": "Download Failed",
    "tryAgain": "Try Again",
    "menu": "Menu"
  }
}
```

## Components

### DarkLanguageSwitcher

- Custom language switcher designed for dark themes
- Matches the ModernRestaurantTemplate's aesthetic
- Features backdrop blur and glassmorphism design
- Responsive design with mobile-friendly labels

### ModernRestaurantTemplate Updates

- Added `useTranslation` hook
- Replaced all hardcoded text with translation keys
- Integrated DarkLanguageSwitcher in the header
- Updated WhatsApp message to use translations
- Currency display now uses translation keys

### DownloadMenu & StorePDFDownload Updates

- Added `useTranslation` hook to both components
- Replaced hardcoded text with translation keys
- PDF generation messages now support multiple languages
- Error messages are translated
- Menu titles in PDF are translated

## Usage

### For Store Owners

1. The language switcher appears in the top-right corner of the store
2. Users can switch between English and Indonesian
3. Language preference is saved in localStorage
4. All text content updates immediately when language is changed

### For Developers

1. Add new translation keys to both `en/common.json` and `id/common.json`
2. Use the `t()` function from `useTranslation()` hook
3. Follow the existing pattern for nested translation keys

## Technical Implementation

### Dependencies

- `react-i18next` - Main i18n library
- `i18next` - Core translation engine

### Configuration

- Language detection from localStorage
- Fallback to English if no language is set
- Automatic language persistence

### File Structure

```
src/
├── components/
│   └── DarkLanguageSwitcher.tsx
├── locales/
│   ├── en/
│   │   └── common.json
│   └── id/
│       └── common.json
├── lib/
│   ├── i18n.ts
│   └── constant.ts
└── templates/
    └── ModernRestaurantTemplate.tsx
```

## Adding New Languages

To add a new language (e.g., Chinese):

1. Create `src/locales/zh/common.json`
2. Add the language to `src/lib/i18n.ts`:
   ```typescript
   resources: {
     en: { translation: en },
     id: { translation: id },
     zh: { translation: zh }, // Add this line
   }
   ```
3. Update `DarkLanguageSwitcher.tsx` to include the new language option
4. Add language constants to `src/lib/constant.ts`

## Best Practices

1. **Always use translation keys** - Never hardcode text in components
2. **Keep translations organized** - Use nested objects for related translations
3. **Test both languages** - Ensure all text is properly translated
4. **Consider context** - Some translations may need context-specific versions
5. **Use interpolation** - For dynamic content like prices and names

## Future Enhancements

- [ ] Add more languages (Chinese, Japanese, etc.)
- [ ] Implement RTL support for Arabic
- [ ] Add language detection based on browser settings
- [ ] Create translation management interface
- [ ] Add pluralization support
- [ ] Implement date/time formatting per locale

## Testing

To test the multi-language implementation:

1. Open a store using the ModernRestaurantTemplate
2. Click the language switcher in the top-right corner
3. Verify all text content changes appropriately
4. Check that the language preference persists on page refresh
5. Test on both desktop and mobile devices

## Support

For issues or questions about the multi-language implementation, refer to:

- React i18next documentation: https://react.i18next.com/
- i18next documentation: https://www.i18next.com/
