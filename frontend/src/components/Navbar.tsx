'use client';

import React from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  Sun,
  Moon,
  Globe,
  Sparkles,
  PhoneCall,
  ShieldCheck,
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
  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#070A12]/85 border-amber-500/20 text-white'
          : 'bg-white/90 border-amber-300/60 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Dubai DLD & Live Ticker Bar */}
      <div
        className={`text-[11px] py-1.5 px-4 border-b ${
          isDark
            ? 'bg-slate-950/90 border-slate-800/80 text-slate-400'
            : 'bg-amber-50/80 border-amber-200/60 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              DLD & RERA Regulated Brokerage • ORN #31940
            </span>
            <span className="hidden md:inline opacity-75">
              Downtown Dubai • Palm Jumeirah • Dubai Marina • Business Bay
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-emerald-400 font-semibold">
              0% Property & Capital Gains Tax • 10-Yr UAE Golden Visa Advisory
            </span>
            <a
              href="tel:+97145559900"
              className="flex items-center gap-1 font-semibold text-amber-400 hover:underline"
            >
              <PhoneCall className="w-3 h-3" /> +971 4 555 9900
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Identity with Official MGN Logo */}
        <button
          onClick={() => setActiveView('showcase')}
          className="flex items-center gap-3.5 text-left group"
        >
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-500/40 bg-[#050A1F] flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-wider gold-shimmer">
                MGN MARKETING
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold uppercase">
                DUBAI
              </span>
            </div>
            <p className="text-[11px] opacity-60 tracking-widest uppercase">
              Luxury Real Estate & Enterprise Hub
            </p>
          </div>
        </button>

        {/* Center Navigation Links (Showcase mode) */}
        {activeView === 'showcase' && (
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <a href="#portfolio" className="hover:text-amber-400 transition-colors">
              Exclusive Portfolio
            </a>
            <a href="#communities" className="hover:text-amber-400 transition-colors">
              Dubai Communities
            </a>
            <a href="#owners" className="hover:text-amber-400 transition-colors">
              Owners & Partners
            </a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">
              ROI & Mortgage Suite
            </a>
            <a href="#advisors" className="hover:text-amber-400 transition-colors">
              RERA Advisors
            </a>
          </nav>
        )}

        {/* Right Controls: Mode Switcher, Currency, Theme, VIP CTA */}
        <div className="flex items-center gap-2.5">
          {/* Switch between Public Website, Client & Leads Desk & Business Management OS */}
          <div
            className={`p-1 rounded-2xl border flex items-center ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setActiveView('showcase')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'showcase'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dubai Showcase</span>
            </button>
            <button
              onClick={() => setActiveView('clients')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'clients'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients & Leads</span>
            </button>
            <button
              onClick={() => setActiveView('portal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'portal'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Business OS</span>
            </button>
          </div>

          {/* Multi-Currency Selector */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-bold ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="AED" className="bg-slate-900 text-white">
                AED
              </option>
              <option value="USD" className="bg-slate-900 text-white">
                USD ($)
              </option>
              <option value="EUR" className="bg-slate-900 text-white">
                EUR (€)
              </option>
              <option value="GBP" className="bg-slate-900 text-white">
                GBP (£)
              </option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? 'Switch to Arabian Pearl Light Theme' : 'Switch to Obsidian Gold Dark Theme'}
            className={`p-2.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-500/50'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* VIP Consultation Button */}
          <button
            onClick={onOpenQuickInquiry}
            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            VIP Advisory
          </button>
        </div>
      </div>
    </header>
  );
}
