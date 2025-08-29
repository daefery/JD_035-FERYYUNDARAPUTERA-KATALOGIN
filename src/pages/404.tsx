import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Try to redirect to the correct route after a short delay
    const timer = setTimeout(() => {
      // If it's a store route, try to load it
      if (router.asPath.startsWith('/store/')) {
        // Let the client-side routing handle it
        return;
      }
      // Otherwise redirect to home
      router.push('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-gray-300 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <div className="mb-4">
            <LoadingSpinner message="Redirecting..." />
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg text-white hover:bg-opacity-30 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
