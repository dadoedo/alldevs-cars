'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useSettings } from '@/lib/useSettings';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Domov', href: '/' },
    { name: 'Ponuka áut', href: '/auta' },
    { name: 'Služby', href: '/sluzby' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header className={`bg-dark-900 shadow-lg border-b border-dark-700 transition-all duration-300 ${
      isScrolled ? 'shadow-xl shadow-primary-500/10' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image 
                src="/logo.png" 
                alt={settings?.site_name || "Logo"} 
                width={180} 
                height={60}
                className="h-15 w-45 transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-secondary hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-dark-muted hover:text-primary-500 transition-colors duration-300 cursor-pointer">
              <Phone className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
              <span>{settings?.phone || "+421 XXX XXX XXX"}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-dark-muted hover:text-primary-500 transition-colors duration-300 cursor-pointer">
              <Mail className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
              <span>{settings?.email || "info@autobazar.sk"}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-secondary hover:text-primary-500 focus:outline-none focus:text-primary-500 transition-all duration-300 hover:scale-110"
            >
              <div className="transition-transform duration-300">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800 border-t border-dark-700">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-secondary hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-dark-700"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-700">
              <div className="flex items-center space-x-2 text-sm text-dark-muted px-3 py-2 hover:text-primary-500 transition-colors duration-300">
                <Phone className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                <span>{settings?.phone || "+421 XXX XXX XXX"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-dark-muted px-3 py-2 hover:text-primary-500 transition-colors duration-300">
                <Mail className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                <span>{settings?.email || "info@autobazar.sk"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
