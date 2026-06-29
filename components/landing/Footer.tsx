'use client';

import Link from 'next/link';
import { Wrench, MapPin, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-card-border pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-4 h-4 text-navy" />
                </div>
                <MapPin className="w-3 h-3 text-primary absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tight">
                Fix<span className="text-primary">It</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              AI-powered civic reporting that holds authorities accountable. Built for communities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/map" className="text-sm text-text-secondary hover:text-primary transition-colors">Live Map</Link></li>
              <li><Link href="/report" className="text-sm text-text-secondary hover:text-primary transition-colors">Report Issue</Link></li>
              <li><Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition-colors">Impact Dashboard</Link></li>
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Roles</h3>
            <ul className="space-y-3">
              <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors">Citizens</Link></li>
              <li><Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">Department Admins</Link></li>
              <li><Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">Super Admins</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Data Security</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} FixIt Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Powered by</span>
            <span className="font-semibold text-primary">AI & Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
