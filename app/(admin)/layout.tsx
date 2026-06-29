'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  MapPin, 
  LayoutDashboard, 
  ListTodo, 
  Globe2, 
  Users, 
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const { profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    window.location.href = '/';
  };

  const isSuperAdmin = profile?.role === 'super_admin';

  const navLinks = [
    { 
      href: '/admin/department', 
      label: 'Department Queue', 
      icon: ListTodo,
      show: true 
    },
    { 
      href: '/admin/super', 
      label: 'City Overview', 
      icon: Globe2,
      show: isSuperAdmin 
    },
    { 
      href: '/admin/users', 
      label: 'User Management', 
      icon: Users,
      show: isSuperAdmin 
    },
    { 
      href: '/dashboard', 
      label: 'Public Analytics', 
      icon: LayoutDashboard,
      show: true 
    },
  ];

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed lg:sticky top-0 left-0 z-50 w-[280px] h-screen bg-navy-light border-r border-card-border flex flex-col transition-transform lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-card-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-navy" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              Fix<span className="text-primary">It</span> <span className="text-sm font-normal text-text-secondary">Admin</span>
            </span>
          </Link>
          <button 
            className="ml-auto lg:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-card-border bg-navy/20">
          <div className="font-semibold text-text-primary mb-1">
            {profile?.full_name || 'Admin User'}
          </div>
          <div className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
            {profile?.role === 'super_admin' ? 'Super Admin' : 'Department Admin'}
          </div>
          {profile?.department && (
            <div className="text-sm text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {profile.department}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.filter(link => link.show).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-navy' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-card-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-urgency-red hover:bg-urgency-red/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-navy-light/50 backdrop-blur-md border-b border-card-border sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <button className="text-text-secondary hover:text-text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-urgency-red rounded-full" />
            </button>
            <button className="text-text-secondary hover:text-text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
