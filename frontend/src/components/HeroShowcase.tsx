'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  Building2,
  ShieldCheck,
  Phone,
  LayoutDashboard,
  Users,
  CheckCircle2,
  Compass,
  Gem,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { Property, Agent } from '@/types';
import { CurrencyCode, formatCurrency } from '@/lib/api';

interface HeroShowcaseProps {
  properties: Property[];
  agents: Agent[];
  currency: CurrencyCode;
  isDark: boolean;
  onSelectProperty: (property: Property) => void;
  onOpenPortal: () => void;
  onOpenClients?: () => void;
  onOpenQuickInquiry: (defaultNote?: string) => void;
}

const COMMUNITIES = [
  'All',
  'Downtown Dubai',
  'Palm Jumeirah',
  'Dubai Marina',
  'Business Bay',
  'Dubai Hills Estate',
  'Dubai Creek Harbour',
];

const LISTING_TYPES = ['All', 'Off-Plan', 'Secondary / Ready', 'Luxury Rental'];

const DUBAI_DEVELOPERS = [
  { name: 'EMAAR PROPERTIES', tag: 'Master Developer • Burj Khalifa & Downtown' },
  { name: 'OMNIYAT', tag: 'Ultra-Luxury Architectural Icons' },
  { name: 'BINGHATTI', tag: 'Bugatti, Mercedes-Benz & Jacob & Co Residences' },
  { name: 'NAKHEEL', tag: 'Palm Jumeirah & Palm Jebel Ali' },
  { name: 'MERAAS', tag: 'Bvlgari Resort, Bluewaters & City Walk' },
  { name: 'DAMAC LUXURY', tag: 'Cavalli & De Grisogono Branded Towers' },
  { name: 'SOBHA REALTY', tag: 'Sobha Hartland Waterfront Villas' },
  { name: 'SELECT GROUP', tag: 'Six Senses & Marina Gate Collection' },
];

export default function HeroShowcase({
  properties,
  agents,
  currency,
  isDark,
  onSelectProperty,
  onOpenPortal,
  onOpenClients,
  onOpenQuickInquiry,
}: HeroShowcaseProps) {
  const [selectedCommunity, setSelectedCommunity] = useState('All');
  const [selectedListingType, setSelectedListingType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [goldenVisaOnly, setGoldenVisaOnly] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedCommunity !== 'All' && p.community !== selectedCommunity) return false;
      if (selectedListingType !== 'All' && p.listingType !== selectedListingType) return false;
      if (goldenVisaOnly && !p.goldenVisaEligible) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.community.toLowerCase().includes(q) ||
          p.developer.toLowerCase().includes(q) ||
          p.referenceCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [properties, selectedCommunity, selectedListingType, goldenVisaOnly, searchQuery]);

  const totalPortfolioAED = useMemo(
    () => properties.reduce((acc, item) => acc + (item.priceAED || 0), 0),
    [properties]
  );

  const featuredSpotlight = useMemo(
    () => properties.find((p) => p.featured) || properties[0],
    [properties]
  );

  return (
    <div className="overflow-hidden">
      {/* ==================== CINEMATIC LUXURY DUBAI HERO ==================== */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden py-16 lg:py-24">
        {/* Animated Ken Burns Dubai Skyline Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2200&q=85"
            alt="Dubai Skyline"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-r from-[#070A12] via-[#070A12]/90 to-[#070A12]/50'
                : 'bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/45'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-transparent to-black/30" />
        </div>

        {/* Ambient Floating Gold Glow Orbs */}
        <motion.div
          animate={{ y: [0, -25, 0], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Quick Search */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-3 pr-4 pl-2 py-1.5 rounded-full bg-slate-950/85 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-widest shadow-xl backdrop-blur-md"
              >
                <img
                  src="/mgn-logo.png"
                  alt="MGN Logo"
                  className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                />
                <span>MGN Marketing • Premier Dubai Real Estate</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl lg:text-[64px] font-bold text-white leading-[1.07] tracking-tight"
              >
                Where Iconic <span className="gold-shimmer">Dubai Architecture</span> Meets Private Wealth.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light"
              >
                Acquire trophy Penthouses in Downtown Dubai, private beachfront Villas on Palm
                Jumeirah, and high-yield off-plan allocations — backed by MGN Marketing&apos;s
                integrated client, deal, and advisory platform.
              </motion.p>

              {/* Interactive Glassmorphic Quick Finder Bar */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28 }}
                className="p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-2xl max-w-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full cursor-pointer"
                    >
                      {COMMUNITIES.map((c) => (
                        <option key={c} value={c} className="bg-slate-950 text-white">
                          {c === 'All' ? 'All Prime Dubai Districts' : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <select
                      value={selectedListingType}
                      onChange={(e) => setSelectedListingType(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full cursor-pointer"
                    >
                      {LISTING_TYPES.map((lt) => (
                        <option key={lt} value={lt} className="bg-slate-950 text-white">
                          {lt === 'All' ? 'All Listing Types' : lt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <a
                    href="#portfolio"
                    className="sm:col-span-3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Explore
                  </a>
                </div>
              </motion.div>

              {/* Secondary Action Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3 pt-1"
              >
                {onOpenClients && (
                  <button
                    onClick={onOpenClients}
                    className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    Manage Clients & Leads
                  </button>
                )}
                <button
                  onClick={onOpenPortal}
                  className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  Open Business OS
                </button>
              </motion.div>

              {/* Animated Metrics Strip */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-white/15"
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-amber-400">
                    {formatCurrency(totalPortfolioAED || 240950000, currency, true)}
                  </p>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Exclusive Portfolio
                  </span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white">
                    8.4% – 12%
                  </p>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Tax-Free Net Yield
                  </span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
                    0% Tax
                  </p>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    Income & Capital Gains
                  </span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white">
                    10-Year
                  </p>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider">
                    UAE Golden Visa Desk
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating 3D-Style Featured Deal Spotlight Card */}
            {featuredSpotlight && (
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.25 }}
                className="lg:col-span-5 hidden lg:block"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  onClick={() => onSelectProperty(featuredSpotlight)}
                  className="group relative rounded-3xl overflow-hidden bg-slate-950/85 backdrop-blur-2xl border border-amber-500/35 shadow-2xl cursor-pointer"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={featuredSpotlight.images[0]}
                      alt={featuredSpotlight.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                        MGN Trophy Spotlight
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-slate-950 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {featuredSpotlight.roiEstimate}% ROI
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-5 right-5">
                      <span className="text-xs text-amber-300 font-semibold uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {featuredSpotlight.community} •{' '}
                        {featuredSpotlight.developer}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white mt-1">
                        {featuredSpotlight.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                          Valuation
                        </span>
                        <span className="text-2xl font-display font-bold text-amber-400">
                          {formatCurrency(featuredSpotlight.priceAED, currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                          Payment Plan
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                          {featuredSpotlight.paymentPlan?.summary}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-amber-400" />
                        {featuredSpotlight.bedrooms} Suites
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-amber-400" />
                        {featuredSpotlight.areaSqFt.toLocaleString('en-US')} SqFt
                      </span>
                      <span className="flex items-center justify-end gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                        Inspect <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== INFINITE DUBAI DEVELOPER PARTNER MARQUEE ==================== */}
      <div
        className={`py-5 border-y overflow-hidden ${
          isDark
            ? 'bg-[#050811] border-slate-800/80 text-slate-300'
            : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}
      >
        <div className="animate-marquee flex items-center gap-14">
          {[...DUBAI_DEVELOPERS, ...DUBAI_DEVELOPERS].map((dev, index) => (
            <div key={index} className="flex items-center gap-4 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <div>
                <span className="font-display font-bold text-sm tracking-widest text-white">
                  {dev.name}
                </span>
                <span className="text-xs text-slate-400 ml-2.5">{dev.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== WHY INVEST WITH MGN MARKETING (3 PILLARS) ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Gem,
              tag: 'Direct Developer Access',
              title: 'Zero Commission Off-Plan Allocations',
              desc: 'Priority VIP access to pre-launch floors and penthouse units from Emaar, Omniyat, Binghatti, and Nakheel with 0% buyer agency commission.',
            },
            {
              icon: Award,
              tag: '10-Year UAE Residency',
              title: 'Complimentary Golden Visa Desk',
              desc: 'Full DLD title deed registration and 10-Year UAE Golden Visa processing for investors and their families on qualifying AED 2M+ assets.',
            },
            {
              icon: Lock,
              tag: 'Regulated Escrow Security',
              title: 'DLD Escrow & Multi-Currency Settlement',
              desc: 'Every transaction is protected under Dubai Land Department RERA escrow laws, supporting bank wire, manager cheques, and compliant USDT settlement.',
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#0C1220]/90 border-slate-800/90 hover:border-amber-500/40'
                    : 'bg-white border-slate-200/90 shadow-md hover:border-amber-400'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  {pillar.tag}
                </span>
                <h3 className="font-display text-xl font-bold mt-1.5 mb-2">{pillar.title}</h3>
                <p className="text-xs leading-relaxed opacity-70">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================== EXCLUSIVE PORTFOLIO & SMART FILTERING ==================== */}
      <section id="portfolio" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              DLD Verified Signature Inventory
            </span>
            <h2
              className={`font-display text-3xl sm:text-5xl font-bold mt-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Curated <span className="gold-shimmer">Dubai Residences</span>
            </h2>
          </div>

          {/* Search & Golden Visa Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-white focus-within:border-amber-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Emaar, Palm, Marina, Ref..."
                className="bg-transparent text-xs focus:outline-none w-52"
              />
            </div>

            <button
              onClick={() => setGoldenVisaOnly(!goldenVisaOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                goldenVisaOnly
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              Golden Visa Eligible
            </button>
          </div>
        </div>

        {/* Community & Listing Type Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {COMMUNITIES.map((comm) => (
              <button
                key={comm}
                onClick={() => setSelectedCommunity(comm)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCommunity === comm
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : isDark
                    ? 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {comm}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LISTING_TYPES.map((lt) => (
              <button
                key={lt}
                onClick={() => setSelectedListingType(lt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedListingType === lt
                    ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                    : isDark
                    ? 'border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {lt}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Properties Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                onClick={() => onSelectProperty(property)}
                className={`group rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                  isDark
                    ? 'bg-[#0C1220]/90 border-slate-800/90 hover:border-amber-500/50 shadow-xl'
                    : 'bg-white border-slate-200 hover:border-amber-400 shadow-lg'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/25" />

                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                      {property.listingType}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/85 text-slate-200 border border-white/15">
                      {property.referenceCode}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/85 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                      <TrendingUp className="w-3 h-3" /> {property.roiEstimate}% ROI
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {property.community}
                      </span>
                      <div className="text-2xl font-display font-bold text-white">
                        {formatCurrency(property.priceAED, currency)}
                      </div>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-medium">
                      {property.developer}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-xs opacity-65 line-clamp-1 mt-1">{property.subtitle}</p>
                  </div>

                  <div
                    className={`grid grid-cols-3 gap-2 py-3 border-y text-xs ${
                      isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-amber-400" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-amber-400" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-amber-400" />
                      <span>{property.areaSqFt.toLocaleString('en-US')} SqFt</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="opacity-70">
                      Plan: <strong className="text-amber-400">{property.paymentPlan?.summary}</strong>
                    </span>
                    <span className="font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Dossier <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ==================== DUBAI MASTER COMMUNITIES ==================== */}
      <section
        id="communities"
        className={`py-20 mt-12 border-y ${
          isDark ? 'bg-[#050811] border-slate-800/80' : 'bg-slate-100/70 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Prime Freehold Zones
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
                Dubai&apos;s Highest-Performing{' '}
                <span className="gold-shimmer">Investment Districts</span>
              </h2>
            </div>
            <p className="text-xs opacity-70 max-w-md">
              Click any master community below to filter available MGN Marketing residences in that
              district.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Downtown Dubai',
                tag: 'Burj Khalifa & Opera District',
                yield: '7.8% Avg Yield',
                price: 'From AED 3.2M',
                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'Palm Jumeirah',
                tag: 'Ultra-Prime Private Beachfront',
                yield: '8.4% Avg Yield',
                price: 'From AED 9.5M',
                img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'Dubai Marina',
                tag: 'Yacht Club & Waterfront Living',
                yield: '9.1% Avg Yield',
                price: 'From AED 2.4M',
                img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'Business Bay',
                tag: 'Canal Branded Sky Mansions',
                yield: '9.6% Avg Yield',
                price: 'From AED 2.1M',
                img: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=900&q=80',
              },
            ].map((c, idx) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onClick={() => {
                  setSelectedCommunity(c.name);
                  document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-xl"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                    {c.yield}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] text-amber-300 uppercase tracking-wider">
                    {c.tag}
                  </span>
                  <h3 className="font-display text-2xl font-bold mt-0.5 flex items-center justify-between">
                    <span>{c.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{c.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUNDERS, OWNERS & MANAGING PARTNERS ==================== */}
      <section id="owners" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Executive Ownership & Leadership
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2">
              Meet the <span className="gold-shimmer">Owners & Managing Partners</span>
            </h2>
          </div>
          <p className="text-xs opacity-75 max-w-md leading-relaxed">
            MGN Marketing Dubai is led directly by its founders and managing partners — delivering
            private client accountability, direct developer allocations, and institutional real
            estate advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              fullName: 'Gul Nawaz',
              title: 'Founder, Owner & Managing Partner',
              badge: 'Founder & Owner • MGN Marketing',
              image: '/gul-nawaz.png',
              specialty: 'Ultra-Prime Dubai Acquisitions, Developer Relations & Private Wealth Desk',
              bio: 'Founder of MGN Marketing — leading strategic vision, master developer partnerships across Downtown Dubai and Palm Jumeirah, and high-net-worth private client acquisitions.',
              stats: [
                { label: 'Role', value: 'Founder & Owner' },
                { label: 'Focus', value: 'Trophy Assets & Off-Plan' },
                { label: 'Desk', value: 'Executive Advisory' },
              ],
            },
            {
              fullName: 'Jibran Khan',
              title: 'Co-Founder, Owner & Managing Partner',
              badge: 'Owner & Partner • MGN Marketing',
              image: '/jibran-khan.jpg',
              specialty: 'Global Investor Strategy, Luxury Portfolio Growth & Enterprise Operations',
              bio: 'Driving MGN Marketing’s international investor relations, high-yield portfolio structuring, Golden Visa advisory, and digital real estate enterprise operations.',
              stats: [
                { label: 'Role', value: 'Owner & Partner' },
                { label: 'Focus', value: 'Global HNW Portfolios' },
                { label: 'Desk', value: 'VIP Client Strategy' },
              ],
            },
          ].map((partner, idx) => (
            <motion.div
              key={partner.fullName}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.12 }}
              className={`group relative rounded-3xl overflow-hidden border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-gradient-to-br from-[#0C1220] via-[#090E1A] to-[#070A12] border-amber-500/35 hover:border-amber-400 shadow-2xl'
                  : 'bg-white border-amber-300/80 shadow-xl hover:border-amber-500'
              }`}
            >
              {/* Subtle top gold bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative w-44 h-52 sm:w-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl shrink-0 bg-slate-900">
                  <img
                    src={partner.image}
                    alt={partner.fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider text-center shadow">
                    {partner.stats[0].value}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> {partner.badge}
                  </span>

                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold">
                      {partner.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-amber-400 mt-0.5">
                      {partner.title}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed opacity-75">{partner.bio}</p>

                  <div
                    className={`grid grid-cols-3 gap-2 pt-3 border-t text-xs ${
                      isDark ? 'border-slate-800/80' : 'border-slate-200'
                    }`}
                  >
                    {partner.stats.map((st) => (
                      <div key={st.label}>
                        <span className="text-[10px] uppercase tracking-wider opacity-60 block">
                          {st.label}
                        </span>
                        <span className="font-bold text-amber-400 text-xs">{st.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        onOpenQuickInquiry(
                          `Direct Executive Consultation with ${partner.fullName} (${partner.title})`
                        )
                      }
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" /> Connect with {partner.fullName}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== RERA CERTIFIED ADVISORS ==================== */}
      <section id="advisors" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Private Client Desk
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
              MGN Marketing <span className="gold-shimmer">RERA Executive Advisors</span>
            </h2>
          </div>
          <p className="text-xs opacity-70 max-w-md">
            Multilingual Dubai Land Department licensed specialists handling Golden Visas, escrow
            transfers, and institutional portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0C1220]/90 border-slate-800 hover:border-amber-500/40'
                  : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={agent.avatar}
                  alt={agent.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-amber-400/50"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase text-amber-400">
                    {agent.reraBrn}
                  </span>
                  <h3 className="font-display font-bold text-lg">{agent.fullName}</h3>
                  <p className="text-xs opacity-65">{agent.role}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="opacity-60">Specialty:</span>
                  <span className="font-medium text-right truncate">{agent.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Closed Volume:</span>
                  <span className="font-bold text-amber-400">
                    {formatCurrency(agent.totalSalesVolumeAED, currency, true)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Languages:</span>
                  <span>{agent.languages?.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  onOpenQuickInquiry(
                    `Requesting consultation with ${agent.fullName} (${agent.reraBrn})`
                  )
                }
                className={`mt-5 w-full py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Connect with Advisor
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
