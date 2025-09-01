# 🏪 Katalogin - Restaurant & Store Catalog Platform

A modern, full-stack web application for creating beautiful digital catalogs and menus for restaurants, cafes, and retail stores. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🎨 **Template System**

- **Multiple Themes** - Choose from various professionally designed templates
- **Customizable Layouts** - Each template has unique styling and layout
- **Easy Template Switching** - Change your store's appearance instantly
- **Coming Soon Templates** - Preview upcoming themes
- **Template Preview** - See how templates look before applying

### 🏪 **Store Management**

- **Store Creation** - Set up your store with logo, banner, and contact info
- **Location Services** - Interactive map with drag-and-drop pin placement
- **Address Geocoding** - Automatic address lookup and coordinates
- **Public Store Pages** - Beautiful, responsive store frontends
- **Social Media Integration** - Add Facebook, Instagram, Twitter/X, TikTok links
- **Store Analytics** - Comprehensive performance tracking and insights

### 📋 **Menu Management**

- **Category Management** - Organize menu items into categories
- **Menu Item CRUD** - Full create, read, update, delete functionality
- **Image Upload** - Upload menu item images to Supabase Storage
- **Pricing & Availability** - Set prices and availability status
- **Featured Items** - Highlight special menu items
- **Drag & Drop Reordering** - Easily reorder menu items with visual feedback
- **Menu Analytics** - Track item performance and engagement

### 📊 **Analytics Dashboard**


- **Real-time Tracking** - Monitor store visits, page views, and interactions
- **Interactive Charts** - Beautiful visualizations with Recharts
- **Device Analytics** - Track mobile, desktop, and tablet usage
- **User Behavior** - Analyze bounce rates, session duration, and engagement
- **Geographic Data** - View visitor locations and peak hours
- **Menu Performance** - Track which items are most popular
- **Period Comparison** - Compare performance across different timeframes

### 🚀 **Onboarding System**

- **Guided Setup** - Step-by-step store creation process
- **Template Selection** - Choose your preferred design during onboarding
- **Category & Menu Setup** - Add categories and menu items during onboarding
- **Store Launch** - One-click store publishing
- **Mobile-Optimized** - Responsive onboarding experience

### 🔐 **Authentication & Security**

- **Supabase Auth** - Secure user authentication
- **Google OAuth** - Social login integration
- **Row Level Security** - Database-level security policies
- **User Permissions** - Users can only manage their own stores
- **Protected Routes** - Secure access to dashboard and analytics

### 🎯 **User Experience**

- **Responsive Design** - Works perfectly on all devices
- **Animated Backgrounds** - Beautiful particle animations
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error management
- **Dark Theme** - Consistent dark mode throughout
- **Glassmorphism UI** - Modern, elegant design elements
- **Smooth Animations** - Enhanced user interactions

### 📱 **Public Store Features**

- **Share Store** - Easy sharing with copy link and social media
- **Contact Integration** - Click-to-call, email, and map directions
- **Social Media Links** - Direct links to social platforms
- **Featured Banner** - Highlight special announcements
- **Back to Top** - Smooth scrolling navigation
- **Mobile Optimized** - Perfect mobile experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account
- Mapbox account (for location services)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN.git
   cd katalogin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

4. **Set up the database**

   - Run the SQL scripts in your Supabase SQL Editor:
     - `database/schema.sql` - Main database schema
     - `database/templates_schema.sql` - Template system
     - `database/analytics_schema.sql` - Analytics tracking system
     - `database/fix_store_templates_public_access.sql` - Public access policies
     - `database/fix_public_menu_access.sql` - Menu public access
     - `database/fix_all_analytics_rls_final_corrected.sql` - Analytics RLS policies

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:4001](http://localhost:4001)

## 📁 Project Structure

```
katalogin/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ImageUpload.tsx  # Image upload component
│   │   ├── MapLocationPicker.tsx # Interactive map component
│   │   ├── TemplateRenderer.tsx # Dynamic template loader
│   │   ├── SimpleAnalyticsChart.tsx # Custom chart components
│   │   ├── SimpleAnalyticsDashboard.tsx # Analytics dashboard
│   │   ├── EnhancedAnalyticsDashboard.tsx # Full-featured analytics
│   │   ├── Modal.tsx # Reusable modal component
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Next.js pages
│   │   ├── dashboard/       # Admin dashboard pages
│   │   │   ├── analytics.tsx # Analytics dashboard page
│   │   │   ├── stores.tsx   # Store management
│   │   │   └── ...
│   │   ├── onboarding/      # Onboarding system
│   │   │   ├── index.tsx    # Main onboarding page
│   │   │   └── steps/       # Onboarding step components
│   │   ├── store/           # Public store pages
│   │   └── ...
│   ├── services/            # API service functions
│   │   ├── storeService.ts  # Store CRUD operations
│   │   ├── templateService.ts # Template management
│   │   ├── analyticsService.ts # Analytics tracking
│   │   └── publicAnalyticsService.ts # Public analytics
│   ├── templates/           # Store template components
│   │   ├── ModernRestaurantTemplate.tsx
│   │   ├── DefaultTemplate.tsx
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── database.ts      # Database entity types
│   │   └── analytics.ts     # Analytics type definitions
│   ├── utils/               # Utility functions
│   │   └── analytics.ts     # Analytics tracking utilities
│   └── styles/              # Global styles
├── database/                # SQL schema and migrations
│   ├── schema.sql           # Main database schema
│   ├── templates_schema.sql # Template system schema
│   ├── analytics_schema.sql # Analytics system schema
│   └── ...
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Core Tables

- **stores** - Store information and settings
- **categories** - Menu categories
- **menu_items** - Individual menu items
- **templates** - Available store templates
- **store_templates** - Store-template relationships

### Analytics Tables

- **store_visits** - Track store visits and sessions
- **page_views** - Monitor page view activity
- **user_interactions** - Track user engagement
- **menu_item_analytics** - Menu item performance data
- **daily_analytics** - Aggregated daily statistics

### Key Features

- **UUID Primary Keys** - Secure, unique identifiers
- **Row Level Security** - Database-level access control
- **Automatic Timestamps** - Created/updated tracking
- **Foreign Key Relationships** - Data integrity
- **Analytics Triggers** - Automatic data aggregation

## 📊 Analytics System

### Tracking Features

- **Store Visits** - Track unique visitors and sessions
- **Page Views** - Monitor page engagement
- **User Interactions** - Track clicks, social media engagement
- **Menu Performance** - Analyze item popularity and engagement
- **Device Analytics** - Mobile, desktop, tablet usage
- **Geographic Data** - Visitor locations and peak hours

### Dashboard Features

- **Interactive Charts** - Bar, line, and pie charts
- **Real-time Data** - Live analytics updates
- **Period Comparison** - Compare different timeframes
- **Export Options** - Download analytics data
- **Mobile Responsive** - Works on all devices

## 🎨 Template System

### Available Templates

- **Modern Restaurant Template** - Elegant dark theme with modern styling
- **Default Template** - Clean, professional design
- **Coming Soon** - More templates in development

### Template Features

- **Responsive Design** - Mobile-first approach
- **Custom Styling** - Unique colors and layouts
- **Menu Organization** - Category-based menu display
- **Contact Information** - Integrated contact details
- **Social Media Integration** - Built-in social links
- **Analytics Integration** - Automatic tracking

## 🚀 Onboarding System

### Step-by-Step Process

1. **Welcome** - Introduction and overview
2. **Store Setup** - Basic store information
3. **Template Selection** - Choose your design
4. **Categories & Menu** - Add menu structure
5. **Launch Store** - Publish your store

### Features

- **Guided Experience** - Clear instructions at each step
- **Progress Tracking** - Visual progress indicator
- **Data Persistence** - Save progress automatically
- **Mobile Optimized** - Responsive design
- **Error Handling** - Graceful error management

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration (for location picker)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Supabase Setup

1. Create a new Supabase project
2. Enable authentication with Google OAuth
3. Set up storage buckets for images
4. Configure RLS policies
5. Run database migration scripts
6. Set up analytics tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **AWS** - Scalable cloud hosting

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript** - Type-safe development
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Tailwind CSS** - Utility-first styling

## 📈 Recent Updates

### Latest Features Added

- **📊 Analytics Dashboard** - Comprehensive store performance tracking
- **🚀 Onboarding System** - Guided store setup process
- **🎨 Enhanced Templates** - Improved template system
- **📱 Mobile Optimization** - Better mobile experience
- **🔗 Social Media Integration** - Facebook, Instagram, Twitter/X, TikTok
- **📊 Interactive Charts** - Beautiful data visualizations
- **🔄 Drag & Drop** - Menu item reordering
- **📈 Real-time Analytics** - Live performance monitoring

### Technical Improvements

- **Row Level Security** - Enhanced database security
- **Error Handling** - Better error management
- **Performance** - Optimized loading and rendering
- **Type Safety** - Improved TypeScript coverage
- **Code Quality** - Better code organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Supabase** - Backend as a service
- **Tailwind CSS** - Utility-first CSS framework
- **Mapbox** - Location services
- **Recharts** - Chart library
- **Vercel** - Deployment platform

## 📄 Other Documentation
- **Analytics** - [ANALYTICS_README.md](https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN/blob/main/ANALYTICS_README.md)
- **Localization** - [MULTI_LANGUAGE_README.md](https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN/blob/main/MULTI_LANGUAGE_README.md))
- **PDF Download** - [PDF_DOWNLOAD_README.md](https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN/blob/main/PDF_DOWNLOAD_README.md)
- **Supabase** - [SUPABASE_SETUP.md](https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN/blob/main/SUPABASE_SETUP.md)
- **Vercel** - [VERCEL_DEPLOYMENT.md](https://github.com/daefery/JD_035-FERYYUNDARAPUTERA-KATALOGIN/blob/main/VERCEL_DEPLOYMENT.md)

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the Supabase documentation for backend setup

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**

_Last updated: December 2024_
