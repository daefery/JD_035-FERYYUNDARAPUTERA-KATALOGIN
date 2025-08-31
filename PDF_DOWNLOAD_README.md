# PDF Download Feature

## Overview

The PDF download feature allows store owners and customers to download a beautiful, professional PDF version of the store's menu. The PDF is optimized for A4 portrait format and includes:

- **Cover Page**: Store branding, contact information, and social media links
- **Menu Page**: Featured items and categorized menu items with prices

## Features

### 📄 **A4 Portrait Format**

- Optimized for standard A4 paper (210mm x 297mm)
- Professional layout with proper margins and spacing
- High-quality image rendering

### 🎨 **Cover Page Design**

- Store logo prominently displayed
- Store name and description
- Complete contact information (phone, email, address)
- Social media links with brand colors
- Generation date and time

### 📋 **Menu Page Layout**

- Featured items section with special highlighting
- Categories organized with clear headers
- Menu items with images, descriptions, and prices
- Professional typography and spacing
- Color-coded pricing and availability

### 🖼️ **Image Support**

- High-quality logo and banner images
- Menu item images with proper aspect ratios
- Fallback placeholders for missing images
- Optimized image rendering for PDF

## Technical Implementation

### Dependencies

```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

### Components

#### `StorePDFDownload.tsx`

Main component that handles PDF generation:

- Creates hidden HTML elements for PDF rendering
- Uses html2canvas to capture page layouts
- Generates PDF with jsPDF library
- Handles image loading and error states

#### `DownloadIcon.tsx`

Reusable download icon component for the UI.

### Usage

```tsx
import StorePDFDownload from "@/components/StorePDFDownload";

<StorePDFDownload
  store={store}
  categories={categories}
  menuItems={menuItems}
  className="custom-styles"
/>;
```

### Integration

The PDF download component is integrated into:

- `ModernRestaurantTemplate.tsx`
- `RamenRestaurantTemplate.tsx`

## PDF Structure

### Page 1: Cover Page

```
┌─────────────────────────────────┐
│                                 │
│           [LOGO]                │
│                                 │
│        STORE NAME               │
│                                 │
│    Store Description            │
│                                 │
│    Phone: +6234567890           │
│    Email: store@example.com     │
│    Address: 123 Main St         │
│                                 │
│    [Social Media Links]         │
│                                 │
│    Generated: January 1, 2024   │
│                                 │
└─────────────────────────────────┘
```

### Page 2: Menu Page

```
┌─────────────────────────────────┐
│                                 │
│        STORE NAME - MENU        │
│                                 │
│    ⭐ Featured Items            │
│    ┌─────────┐ ┌─────────┐     │
│    │ Item 1  │ │ Item 2  │     │
│    │ $10.00  │ │ $15.00  │     │
│    └─────────┘ └─────────┘     │
│                                 │
│    Category Name                │
│    ┌─────────┐ ┌─────────┐     │
│    │ Item 3  │ │ Item 4  │     │
│    │ $12.00  │ │ $18.00  │     │
│    └─────────┘ └─────────┘     │
│                                 │
│    Thank you for choosing!      │
│                                 │
└─────────────────────────────────┘
```

## Customization

### Styling

The PDF uses inline styles for consistent rendering:

- Font family: Arial, sans-serif
- Colors: Professional grays and accent colors
- Spacing: Consistent margins and padding
- Layout: Grid-based responsive design

### Content

- **Featured Items**: Automatically filtered and highlighted
- **Categories**: Sorted by `sort_order` and filtered by `is_active`
- **Menu Items**: Filtered by `is_available` and sorted by `sort_order`
- **Contact Info**: Only displays provided information
- **Social Media**: Shows available platforms with brand colors

## Error Handling

- **Image Loading**: Graceful fallbacks for missing images
- **PDF Generation**: Try-catch blocks with user feedback
- **File Download**: Automatic filename generation with store name
- **CORS Issues**: Handled with `useCORS` and `allowTaint` options

## Performance

- **Image Optimization**: Uses Next.js Image component for web display
- **PDF Generation**: Asynchronous processing with loading states
- **Memory Management**: Proper cleanup of canvas elements
- **File Size**: Optimized image quality for reasonable file sizes

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Works on mobile devices
- **PDF Support**: Uses jsPDF for cross-browser compatibility

## Future Enhancements

- [ ] Multiple page support for large menus
- [ ] Custom templates and themes
- [ ] QR code integration
- [ ] Print-friendly CSS styles
- [ ] Batch download for multiple stores
- [ ] PDF preview before download
