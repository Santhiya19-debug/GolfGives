'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-mist-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-navy-800">GolfGives</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#how-it-works" className="nav-link">How It Works</Link>
            <Link href="/#charities" className="nav-link">Charities</Link>
            <Link href="/#draws" className="nav-link">Draws</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">Dashboard</Link>
                <button onClick={handleSignOut} className="nav-link text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-mist-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-mist-100 px-4 py-4 space-y-3">
          <Link href="/#how-it-works" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/#charities" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>Charities</Link>
          <Link href="/#draws" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>Draws</Link>
          <Link href="/contact" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="pt-2 border-t border-mist-100 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary w-full text-center block" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="btn-ghost w-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost w-full text-center block" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/signup" className="btn-primary w-full text-center block" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}