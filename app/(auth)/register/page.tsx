'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [inviteCode, setInviteCode] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (role === 'department_admin' && inviteCode !== 'DEPT2026') {
      setError("Invalid department invite code");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up user in Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Insert profile record (if not handled by DB triggers automatically)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role,
            department: role === 'department_admin' ? 'Roads & Infrastructure' : null // Mock dept for now
          });

        if (profileError) throw profileError;

        // Redirect based on role
        if (role === 'department_admin') {
          router.push('/admin/department');
        } else {
          router.push('/map');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-navy via-navy to-navy-light relative overflow-hidden flex-col justify-center px-12">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-navy" />
              </div>
              <MapPin className="w-4 h-4 text-primary absolute -top-1.5 -right-1.5" />
            </div>
            <span className="text-3xl font-bold text-text-primary tracking-tight">
              Fix<span className="text-primary">It</span>
            </span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join the community. <br />
            <span className="gradient-text">Make a difference.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Every report you make helps hold authorities accountable and makes our cities safer for everyone.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-navy">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-navy" />
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              Fix<span className="text-primary">It</span>
            </span>
          </Link>

          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-text-secondary mb-8 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-urgency-red bg-urgency-red/10 border border-urgency-red/20 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex bg-navy-light/50 p-1 rounded-xl mb-4 border border-card-border">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  role === 'citizen' ? 'bg-primary text-navy shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('department_admin')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  role === 'department_admin' ? 'bg-primary text-navy shadow-sm' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Dept Admin
              </button>
            </div>

            {role === 'department_admin' && (
              <div className="space-y-1.5 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <label className="text-sm font-medium text-blue-400">Invite Code Required</label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-2 bg-navy border border-blue-500/30 rounded-lg text-text-primary focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                  placeholder="Enter dept invite code (try DEPT2026)"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Confirm</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-navy font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
