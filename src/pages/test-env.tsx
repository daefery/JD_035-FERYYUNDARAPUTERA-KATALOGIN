import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestEnv() {
  const [envVars, setEnvVars] = useState<{
    supabaseUrl: string | undefined
    supabaseKey: string | undefined
  }>({
    supabaseUrl: undefined,
    supabaseKey: undefined
  })
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***SET***' : '***NOT SET***'
    })
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setTestResult('Testing connection...')
      const { data, error } = await supabase.from('stores').select('count').limit(1)
      
      if (error) {
        setTestResult(`❌ Error: ${error.message}`)
      } else {
        setTestResult('✅ Connection successful!')
      }
    } catch (err) {
      setTestResult(`❌ Exception: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">NEXT_PUBLIC_SUPABASE_URL:</h2>
            <p className="bg-gray-100 p-2 rounded font-mono text-sm">
              {envVars.supabaseUrl || 'NOT SET'}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
            <p className="bg-gray-100 p-2 rounded font-mono text-sm">
              {envVars.supabaseKey}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Current URL:</h2>
            <p className="bg-gray-100 p-2 rounded font-mono text-sm">
              {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Environment:</h2>
            <p className="bg-gray-100 p-2 rounded font-mono text-sm">
              {process.env.NODE_ENV}
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={testSupabaseConnection}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Supabase Connection
            </button>
            {testResult && (
              <p className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                {testResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
