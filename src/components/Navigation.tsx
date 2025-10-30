import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Plane, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.flights'), href: '#flights' },
    { name: t('nav.hotels'), href: '#hotels' },
    { name: t('nav.tours'), href: '#tours' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'top-4 w-[95%] max-w-6xl bg-white/10 backdrop-blur-lg rounded-full' 
            : 'top-0 w-full bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
          }`}>
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary" />
              <a href="#home" className="text-xl font-bold">Travelexa</a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                className="text-primary font-bold text-sm hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.flights')}
              </button>
              <button 
                className="text-primary font-bold text-sm hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.hotels')}
              </button>
              <LanguageSwitcher />
              <button
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                )}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-l border-white/20 z-50 transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="px-6 pb-8">
          {/* Navigation Links */}
          <div className="space-y-6 mb-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-lg font-serif text-white hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/20 mb-8" />

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Contact Us
            </h3>
            
            <div className="space-y-4">
              <a
                href="mailto:hello@travelworldescape.com"
                className="flex items-start gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                <span className="text-sm">hello@travelworldescape.com</span>
              </a>
              
              <a
                href="tel:+39041887757"
                className="flex items-start gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                <span className="text-sm">+39 041 88 77 757</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-white/20">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                Follow Us
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 5.42 3.92 9.97 9 10.93V15.97h-2.7V12h2.7v-2.6c0-2.65 1.56-4.1 3.98-4.1 1.15 0 2.35.2 2.35.2v2.58h-1.32c-1.3 0-1.7.81-1.7 1.64V12h2.9l-.46 2.97h-2.44v6.96A10 10 0 0 0 22 12a10 10 0 0 0-10-10z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5M9 19c9 2 20-3 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
