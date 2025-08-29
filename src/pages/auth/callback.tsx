import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_callback_failed')
        return
      }

      if (data.session) {
        // Successful authentication
        router.push('/dashboard')
      } else {
        // No session found
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return <LoadingSpinner message="Completing authentication..." />
}
