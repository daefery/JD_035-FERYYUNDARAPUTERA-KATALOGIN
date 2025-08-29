# Katalogin - Digital Catalog Solution

A modern, beautiful digital catalog application built with Next.js, TypeScript, and Supabase authentication.

## Features

- 🔐 **Supabase Authentication** - Secure email/password and Google OAuth login
- ✨ **Animated Particle Background** - Beautiful visual effects
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI/UX** - Glassmorphism design with smooth animations
- 🔒 **Protected Routes** - Secure dashboard for authenticated users
- ⚡ **TypeScript** - Full type safety and better development experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd katalogin
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase authentication:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Create a `.env.local` file with your Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:4001](http://localhost:4001) with your browser to see the result.

## Project Structure

```
src/
├── components/
│   └── ParticleBackground.tsx    # Animated particle background
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── pages/
│   ├── auth/
│   │   └── callback.tsx         # OAuth callback handler
│   ├── dashboard.tsx            # Protected dashboard page
│   ├── login.tsx                # Login page
│   ├── register.tsx             # Registration page
│   └── index.tsx                # Homepage
└── styles/
    └── globals.css              # Global styles
```

## Available Pages

- **Homepage** (`/`) - Landing page with navigation to login/register
- **Login** (`/login`) - Email/password and Google OAuth login
- **Register** (`/register`) - User registration with validation
- **Dashboard** (`/dashboard`) - Protected user dashboard (requires authentication)
- **Stores Management** (`/dashboard/stores`) - Manage restaurant/store catalogs
- **Create Store** (`/dashboard/stores/create`) - Create new store catalog
- **Auth Callback** (`/auth/callback`) - Handles OAuth redirects

## Authentication Features

- **Email/Password Registration** - Secure user registration
- **Email/Password Login** - Traditional authentication
- **Google OAuth** - Social login with Google
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Session Management** - Persistent login sessions
- **User Metadata** - Store additional user information

## Store Management Features

- **Store Creation** - Create restaurant/store catalogs with custom URLs
- **Store Management** - View, edit, and delete your stores
- **Store Information** - Manage store details, contact info, and images
- **Unique URLs** - Each store gets a unique slug for public access
- **Row Level Security** - Users can only access their own stores

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service with authentication
- **Geist Font** - Modern typography

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your Supabase environment variables to your deployment platform!
