'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  // Don't show navbar on landing, login, register, or onboarding pages
  const hideNavbar = ['/', '/login', '/register', '/onboarding'].includes(pathname);
  
  if (hideNavbar || !isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/discover', label: 'Discover', icon: '🔥' },
    { href: '/matches', label: 'Matches', icon: '💕' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/discover" className="flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <span className="text-xl font-bold text-white">DevConnect</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
