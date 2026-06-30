'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { setUser, setProfile } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let loginEmail = email;
      let loginPassword = password;
      
      // Demo bypass
      if (email === '1' && password === '1') {
        loginEmail = 'citizen1@example.com';
        loginPassword = 'Password123!';
      } else if (email === '2' && password === '2') {
        loginEmail = 'admin.roads@bangalore.gov.in';
        loginPassword = 'Password123!';
      } else if (email === '3' && password === '3') {
        loginEmail = 'super@fixit.local';
        loginPassword = 'Password123!';
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (authError) throw authError;

      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email! });
        
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) setProfile(profile as any);

        // Redirect based on role
        if (profile?.role === 'department_admin') {
          router.push('/admin/department');
        } else if (profile?.role === 'super_admin') {
          router.push('/admin/super');
        } else {
          router.push('/map');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
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
            Welcome back to a <br />
            <span className="gradient-text">better neighborhood.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Log in to report new issues, track the status of your existing reports, and help your community thrive.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
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

          <h2 className="text-2xl font-bold mb-2">Log in to your account</h2>
          <p className="text-text-secondary mb-8 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register as Citizen
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-urgency-red bg-urgency-red/10 border border-urgency-red/20 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy-light/50 border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-navy font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
