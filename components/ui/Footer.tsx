import Link from 'next/link';
import { Trophy, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">GolfGives</span>
            </div>
            <p className="text-brand-200 text-sm leading-relaxed">
              Where every round you play contributes to a charity you love and a prize draw worth winning.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-brand-300 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              London Eye, London UK
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-300 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-brand-100">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/#charities" className="hover:text-white transition-colors">Charities</Link></li>
              <li><Link href="/#draws" className="hover:text-white transition-colors">Draws & Prizes</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-brand-100">
              <li><Link href="/signup" className="hover:text-white transition-colors">Subscribe Now</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-300 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-brand-100">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                (+876) 765 665
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                hello@golfgives.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                London Eye, London UK
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-brand-300">
          <span>© 2026 GolfGives · All Rights Reserved</span>
          <span>Built with purpose. Playing for good.</span>
        </div>
      </div>
    </footer>
  );
}