import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Store slug is required' });
  }

  try {
    // Create a client that bypasses RLS for public access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // Query stores table directly (bypasses RLS)
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Store not found' });
      }
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch store' });
    }

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Return store data without sensitive information
    const publicStore = {
      id: store.id,
      slug: store.slug,
      name: store.name,
      description: store.description,
      logo_url: store.logo_url,
      banner_url: store.banner_url,
      address: store.address,
      phone: store.phone,
      email: store.email,
      website: store.website,
      is_active: store.is_active,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };

    return res.status(200).json(publicStore);

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
