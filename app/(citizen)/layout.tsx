'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, MapPin, Menu, X, Home, FileText, User, LogOut, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import { getUrgencyColor } from '@/lib/utils';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const { profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/map', label: 'Live Map', icon: MapPin },
    { href: '/report', label: 'Report Issue', icon: Wrench },
    { href: '/my-reports', label: 'My Reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-card-border h-16">
        <div className="section-container h-full flex items-center justify-between">
          <Link href="/map" className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-navy" />
              </div>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight hidden sm:block">
              Fix<span className="text-primary">It</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary text-navy' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <button className="text-text-secondary hover:text-text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-urgency-red rounded-full" />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-card-border">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{profile?.full_name || 'Citizen'}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
                    Score: {profile?.reputation_score || 100}
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center border border-primary/30">
                <User className="w-5 h-5 text-text-secondary" />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-navy-light border-b border-card-border overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl font-medium ${
                      isActive ? 'bg-primary text-navy' : 'text-text-secondary'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="h-px bg-card-border my-2" />
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl font-medium text-urgency-red hover:bg-urgency-red/10 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
