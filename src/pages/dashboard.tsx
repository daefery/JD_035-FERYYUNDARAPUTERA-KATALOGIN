import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import { useAuth } from '@/contexts/AuthContext';
import ParticleBackground from '@/components/ParticleBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

const geist = Geist({
  subsets: ['latin'],
});

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`${geist.className} min-h-screen relative overflow-hidden`}>
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Katalogin</h1>
              <p className="text-gray-300">Your Digital Catalog Dashboard</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <p className="text-white">{user.user_metadata?.firstName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <p className="text-white">{user.user_metadata?.lastName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Verified</label>
                <p className="text-white">{user.email_confirmed_at ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Sign In</label>
                <p className="text-white">{new Date(user.last_sign_in_at || '').toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/dashboard/stores')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Manage Stores
                </button>
                <button 
                  onClick={() => router.push('/dashboard/stores/create')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create New Store
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Import Data
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-gray-300 text-sm">
                  <p>• Successfully signed in</p>
                  <p>• Account created</p>
                  <p>• Welcome to Katalogin!</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Catalogs</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Items</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Views</span>
                  <span className="text-white font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
