'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Building2,
  LayoutDashboard,
  Users,
  Sun,
  Moon,
  ArrowUpRight,
} from 'lucide-react';
import { CurrencyCode } from '@/lib/api';

interface NavbarProps {
  activeView: 'showcase' | 'clients' | 'portal';
  setActiveView: (view: 'showcase' | 'clients' | 'portal') => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  onOpenQuickInquiry: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  currency,
  setCurrency,
  isDark,
  setIsDark,
  onOpenQuickInquiry,
}: NavbarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const navItems: {
    id: 'showcase' | 'clients' | 'portal';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'showcase', label: 'Portfolio', icon: Building2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'portal', label: 'Portal', icon: LayoutDashboard },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#080B12]/90 border-white/10 text-white'
          : 'bg-white/95 border-neutral-200/80 text-neutral-900 shadow-sm'
      }`}
    >
      {/* Subtle Top Gold Hairline Accent + Interactive Scroll Progress Bar */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent overflow-hidden">
        <motion.div
          style={{ scaleX }}
          className="origin-left h-full w-full bg-gradient-to-r from-[#B89B5E] via-[#F3E5AB] to-[#D4AF37]"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between gap-6">
        {/* Left: Clean Single-Line Brand Identity */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView('showcase')}
          className="flex items-center gap-3.5 text-left group shrink-0"
        >
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#C5A059]/50 bg-[#050A1F] flex items-center justify-center shadow-md shrink-0 relative luxury-sheen">
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-[0.18em] uppercase leading-tight whitespace-nowrap group-hover:text-[#C5A059] transition-colors">
              MGN MARKETING
            </span>
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#C5A059] font-medium whitespace-nowrap mt-0.5">
              DUBAI LUXURY REALTY
            </span>
          </div>
        </motion.button>

        {/* Center: Uncramped Single-Line Navigation Links */}
        {activeView === 'showcase' ? (
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap">
            {[
              { href: '#buy-section', label: 'Buy' },
              { href: '#rentals-section', label: 'Rentals' },
              { href: '#developments-section', label: 'Developments' },
              { href: '#owners-partners', label: 'Owners & Partners' },
              { href: '#editors-picks', label: 'Journal' },
              { href: '#calculator', label: 'Calculator' },
            ].map((link, idx) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                whileHover={{ y: -1 }}
                className="opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-all py-2 hover-gold-underline"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
        ) : (
          <div className="hidden lg:block" />
        )}

        {/* Right: Sleek Single-Line Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Clean Segmented Switcher with Animated Sliding Pill */}
          <div
            className={`p-1 rounded-full border flex items-center relative ${
              isDark
                ? 'bg-white/[0.04] border-white/10'
                : 'bg-neutral-100 border-neutral-200/80'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors z-10 ${
                    isActive
                      ? 'text-neutral-950'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbarActiveTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[#C5A059] shadow-sm -z-10"
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Minimal Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className={`hidden sm:block px-3 py-2 rounded-full border text-[11px] font-semibold tracking-wider uppercase cursor-pointer focus:outline-none transition-colors ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-neutral-200 hover:border-[#C5A059]/50'
                : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:border-neutral-300'
            }`}
          >
            <option value="AED" className="bg-neutral-900 text-white">
              AED
            </option>
            <option value="USD" className="bg-neutral-900 text-white">
              USD
            </option>
            <option value="EUR" className="bg-neutral-900 text-white">
              EUR
            </option>
            <option value="GBP" className="bg-neutral-900 text-white">
              GBP
            </option>
          </select>

          {/* Theme Toggle with Animated Icon Rotation */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsDark(!isDark)}
            title="Toggle Theme"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors overflow-hidden ${
              isDark
                ? 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-[#C5A059]/50'
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200/70'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center"
              >
                {isDark ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Single-Line Luxury CTA Button */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenQuickInquiry}
            className={`hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] whitespace-nowrap transition-colors luxury-sheen ${
              isDark
                ? 'bg-white text-neutral-950 hover:bg-[#C5A059] hover:text-neutral-950'
                : 'bg-neutral-900 text-white hover:bg-[#C5A059] hover:text-neutral-950'
            }`}
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
