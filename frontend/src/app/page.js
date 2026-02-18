'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.profileCompleted) {
        router.push('/discover');
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-primary-400">Dev</span>
            <span className="text-white">Connect</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary-500 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Find Your Perfect</span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Hackathon Team
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Swipe right on developers who match your skills. Build your dream team with our smart matching algorithm.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-gradient-to-r from-primary-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-primary-400 hover:to-cyan-400 transition-all shadow-lg shadow-primary-500/25"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient p-8 text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-white mb-2">Create Profile</h3>
              <p className="text-gray-400">Add your skills, role, and what you're looking for in teammates</p>
            </div>
            <div className="card-gradient p-8 text-center">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="text-xl font-bold text-white mb-2">Swipe & Match</h3>
              <p className="text-gray-400">Swipe right on developers you want to work with</p>
            </div>
            <div className="card-gradient p-8 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Chat & Build</h3>
              <p className="text-gray-400">When you both swipe right, start chatting instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2026 DevConnect. Built for hackathon enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
