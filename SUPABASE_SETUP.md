# Supabase Authentication Setup

This guide will help you set up Supabase authentication for your Katalogin application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization and enter project details
5. Wait for the project to be created

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project credentials.

## 4. Enable Google OAuth (Optional)

To enable Google social login:

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. You'll need to create a Google OAuth application:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Set the authorized redirect URI to: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret** from Google
5. Paste them into the Supabase Google provider settings
6. Save the configuration

## 5. Configure Email Templates (Optional)

1. In your Supabase dashboard, go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:4001/login`
3. Try signing up with email/password
4. Try signing in with Google (if configured)

## 7. Database Schema (Optional)

If you want to store additional user data, you can create custom tables in Supabase:

```sql
-- Example: Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Make sure you're using the `anon` key, not the `service_role` key
2. **Google OAuth not working**: Check that your redirect URI is correct and matches exactly
3. **Environment variables not loading**: Restart your development server after adding `.env.local`
4. **CORS errors**: Make sure your Supabase project URL is correct

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
