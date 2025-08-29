# 🏪 Katalogin - Restaurant & Store Catalog Platform

A modern, full-stack web application for creating beautiful digital catalogs and menus for restaurants, cafes, and retail stores. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🎨 **Template System**

- **Multiple Themes** - Choose from various professionally designed templates
- **Customizable Layouts** - Each template has unique styling and layout
- **Easy Template Switching** - Change your store's appearance instantly
- **Coming Soon Templates** - Preview upcoming themes

### 🏪 **Store Management**

- **Store Creation** - Set up your store with logo, banner, and contact info
- **Location Services** - Interactive map with drag-and-drop pin placement
- **Address Geocoding** - Automatic address lookup and coordinates
- **Public Store Pages** - Beautiful, responsive store frontends

### 📋 **Menu Management**

- **Category Management** - Organize menu items into categories
- **Menu Item CRUD** - Full create, read, update, delete functionality
- **Image Upload** - Upload menu item images to Supabase Storage
- **Pricing & Availability** - Set prices and availability status
- **Featured Items** - Highlight special menu items

### 🔐 **Authentication & Security**

- **Supabase Auth** - Secure user authentication
- **Google OAuth** - Social login integration
- **Row Level Security** - Database-level security policies
- **User Permissions** - Users can only manage their own stores

### 🎯 **User Experience**

- **Responsive Design** - Works perfectly on all devices
- **Animated Backgrounds** - Beautiful particle animations
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

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
     - `database/fix_store_templates_public_access.sql` - Public access policies
     - `database/fix_public_menu_access.sql` - Menu public access

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
katalogin/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ImageUpload.tsx  # Image upload component
│   │   ├── MapLocationPicker.tsx # Interactive map component
│   │   ├── TemplateRenderer.tsx # Dynamic template loader
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Next.js pages
│   │   ├── dashboard/       # Admin dashboard pages
│   │   ├── store/           # Public store pages
│   │   └── ...
│   ├── services/            # API service functions
│   │   ├── storeService.ts  # Store CRUD operations
│   │   └── templateService.ts # Template management
│   ├── templates/           # Store template components
│   │   ├── RamenRestaurantTemplate.tsx
│   │   ├── DefaultTemplate.tsx
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   └── database.ts      # Database entity types
│   └── styles/              # Global styles
├── database/                # SQL schema and migrations
│   ├── schema.sql           # Main database schema
│   ├── templates_schema.sql # Template system schema
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

### Key Features

- **UUID Primary Keys** - Secure, unique identifiers
- **Row Level Security** - Database-level access control
- **Automatic Timestamps** - Created/updated tracking
- **Foreign Key Relationships** - Data integrity

## 🎨 Template System

### Available Templates

- **Default Template** - Clean, modern design
- **Ramen Restaurant** - Dark theme with elegant styling
- **Coming Soon** - More templates in development

### Template Features

- **Responsive Design** - Mobile-first approach
- **Custom Styling** - Unique colors and layouts
- **Menu Organization** - Category-based menu display
- **Contact Information** - Integrated contact details

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
- **Vercel** - Deployment platform

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the Supabase documentation for backend setup

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
