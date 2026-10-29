'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowUpRight,
  Mail,
  MessageSquare,
  Eye,
  Heart,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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

const HERO_SLIDES = [
  {
    tag: 'FEATURED ARCHITECTURAL LANDMARK • DUBAI CANAL',
    title: 'Muraba Veil & Sky Collection',
    subtitle: 'Unparalleled Residences Shaped by Place, Nature and Culture.',
    location: 'Downtown & Canal District',
    priceLabel: 'From AED 18,000,000',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=85',
  },
  {
    tag: 'ULTRA-PRIME WATERFRONT • PALM JUMEIRAH',
    title: 'Atlantis The Royal Sky Mansions',
    subtitle: 'Cantilevered Sky Pool Residences Overlooking the Arabian Gulf.',
    location: 'Palm Jumeirah Crescent',
    priceLabel: 'From AED 45,000,000',
    image:
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2200&q=85',
  },
  {
    tag: 'BRANDED HYPER-TOWER • BUSINESS BAY',
    title: 'Bugatti Residences by Binghatti',
    subtitle: 'French Riviera Inspired Sky Mansions with Private Car-to-Penthouse Elevators.',
    location: 'Business Bay Waterfront',
    priceLabel: 'From AED 52,000,000',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2200&q=85',
  },
];

const COMMUNITIES = [
  'All',
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'Dubai Hills Estate',
  'Dubai Creek Harbour',
  'Palm Jebel Ali',
  'Emaar Beachfront',
];

const PROPERTY_TYPES = ['All', 'Villa', 'Penthouse', 'Apartment', 'Duplex', 'Mansion'];

const LUXURY_RENTAL_SHOWCASE = [
  {
    id: 'rent-1',
    community: 'Palm Jumeirah',
    subCommunity: 'Atlantis The Royal Residences',
    priceAED: 6500000,
    type: 'Townhouse',
    beds: 4,
    sqft: 6317,
    views: 28,
    followers: 6,
    tag: 'Featured',
    headline: 'Prestigious Townhouse at Atlantis The Royal',
    excerpt:
      'Part of Palm Jumeirah’s Atlantis The Royal Residences, this four-bedroom sky townhouse embodies contemporary luxury and private beach living.',
    image:
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'rent-2',
    community: 'Al Barari',
    subCommunity: 'IXORA Botanical Homes',
    priceAED: 450000,
    type: 'Villa',
    beds: 4,
    sqft: 4755,
    views: 19,
    followers: 4,
    tag: 'New to market',
    headline: 'Vacant | 4BR+M | Brand New | Private Rooftop Pool',
    excerpt:
      'MGN Marketing presents this 4-bedroom Ixora residence in Al Barari with lush botanical waterways, floor-to-ceiling glass, and private elevator.',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'rent-3',
    community: 'Downtown Dubai',
    subCommunity: 'The Lana — Dorchester Collection',
    priceAED: 1850000,
    type: 'Penthouse',
    beds: 3,
    sqft: 3920,
    views: 34,
    followers: 9,
    tag: 'Featured',
    headline: 'Full Burj Khalifa & Marasi Marina View | Serviced by Dorchester',
    excerpt:
      'Turnkey designer furnished residence featuring double-height living spaces, private yacht berth access, and 5-star Dorchester hospitality.',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  },
];

const CLIENT_TESTIMONIALS = [
  {
    quote:
      'Great real estate service. Strong and trusted brand. Transparent. All MGN Marketing consultants are very professional and trained to assist clients with courtesy and knowledge-based solutions.',
    author: 'Lord Alexander Kensington',
    location: 'London & Downtown Dubai',
  },
  {
    quote:
      'Best client experience in Dubai real estate. Very personal approach and able to understand the exact architectural and investment needs of our family office. I strongly recommend them.',
    author: 'Viktor & Anna Orlov',
    location: 'Palm Jumeirah Villa Buyers',
  },
  {
    quote:
      'MGN Marketing met all our real estate requirements in purchasing our villa in Dubai Hills through Emaar, and even helped us find a luxury apartment to rent while we relocated from London to Dubai.',
    author: 'Gregory Brison',
    location: 'Dubai Hills Estate',
  },
];

const MARQUEE_DEVELOPMENTS = [
  'MURABA VEIL • DOWNTOWN',
  'ATLANTIS THE ROYAL • PALM JUMEIRAH',
  'BUGATTI RESIDENCES • BUSINESS BAY',
  'BULGARI LIGHTHOUSE • JUMEIRAH BAY',
  'THE LANA DORCHESTER • MARASI MARINA',
  'ONE ZA’ABEEL • DIFC',
  'PALM JEBEL ALI • FROND VILLAS',
  'AL BARARI • IXORA BOTANICAL ESTATES',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroShowcase({
  properties,
  agents,
  currency,
  isDark,
  onSelectProperty,
  onOpenClients,
  onOpenQuickInquiry,
}: HeroShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCommunity, setSelectedCommunity] = useState('All');
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  // Auto-advance Hero Architectural Carousel every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedCommunity !== 'All' && p.community !== selectedCommunity) return false;
      if (selectedPropertyType !== 'All' && p.propertyType !== selectedPropertyType) return false;
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
  }, [properties, selectedCommunity, selectedPropertyType, searchQuery]);

  const heroDevelopment = useMemo(
    () => properties[activeSlide % (properties.length || 1)] || properties[0],
    [properties, activeSlide]
  );

  const currentHero = HERO_SLIDES[activeSlide];

  const dividerColor = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const mutedText = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const cardSurface = isDark
    ? 'bg-[#111111] border-neutral-800/90 text-white'
    : 'bg-white border-neutral-200/90 text-neutral-900';

  return (
    <div>
      {/* ==================== 1. ANIMATED MULTI-SLIDE LUXHABITAT HERO ==================== */}
      <section className="relative h-[86vh] min-h-[640px] flex items-end overflow-hidden bg-black">
        {/* Animated Crossfading Background Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={currentHero.image}
              alt={currentHero.title}
              className="w-full h-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top-Right Slide Controls & Counter */}
        <div className="absolute top-8 right-6 sm:right-10 z-20 flex items-center gap-3">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-white/80 uppercase">
            0{activeSlide + 1} / 0{HERO_SLIDES.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
              }
              className="w-9 h-9 rounded-full bg-black/45 border border-white/25 text-white flex items-center justify-center hover:bg-[#C5A059] hover:text-neutral-950 hover:border-[#C5A059] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="w-9 h-9 rounded-full bg-black/45 border border-white/25 text-white flex items-center justify-center hover:bg-[#C5A059] hover:text-neutral-950 hover:border-[#C5A059] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pb-14 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl text-white space-y-4"
              >
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#D4AF37] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentHero.tag}</span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.05]">
                  {currentHero.title}
                </h1>

                <p className="text-base sm:text-lg text-neutral-200 font-light tracking-wide">
                  {currentHero.subtitle}
                </p>

                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[#C5A059] pt-1">
                  <span>{currentHero.location}</span>
                  <span>•</span>
                  <span>{currentHero.priceLabel}</span>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      heroDevelopment ? onSelectProperty(heroDevelopment) : undefined
                    }
                    className="px-7 py-3.5 bg-white text-neutral-950 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-neutral-950 transition-all shadow-xl"
                  >
                    View development
                  </motion.button>
                  {onOpenClients && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onOpenClients}
                      className="px-6 py-3.5 bg-black/50 backdrop-blur-md border border-white/30 text-white text-xs font-semibold uppercase tracking-[0.18em] hover:bg-white hover:text-neutral-950 transition-all"
                    >
                      Clients &amp; Leads Desk
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Minimalist Architectural Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`w-full lg:max-w-xl p-3 backdrop-blur-md border shadow-2xl ${
                isDark
                  ? 'bg-neutral-950/95 text-white border-neutral-800'
                  : 'bg-white/95 text-neutral-900 border-neutral-200/80'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div
                  className={`sm:col-span-5 px-3 py-2 border-b sm:border-b-0 sm:border-r ${
                    isDark ? 'border-neutral-800' : 'border-neutral-200'
                  }`}
                >
                  <label className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block">
                    Location
                  </label>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none mt-0.5 cursor-pointer"
                  >
                    {COMMUNITIES.map((c) => (
                      <option key={c} value={c} className="bg-neutral-900 text-white">
                        {c === 'All' ? 'All Prime Locations' : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`sm:col-span-4 px-3 py-2 border-b sm:border-b-0 sm:border-r ${
                    isDark ? 'border-neutral-800' : 'border-neutral-200'
                  }`}
                >
                  <label className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 block">
                    Residence Type
                  </label>
                  <select
                    value={selectedPropertyType}
                    onChange={(e) => setSelectedPropertyType(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none mt-0.5 cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-neutral-900 text-white">
                        {t === 'All' ? 'All Property Types' : t}
                      </option>
                    ))}
                  </select>
                </div>

                <a
                  href="#buy-section"
                  className={`sm:col-span-3 py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity ${
                    isDark
                      ? 'bg-[#C5A059] text-neutral-950'
                      : 'bg-neutral-950 text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </a>
              </div>
            </motion.div>
          </div>

          {/* Slide Progress Indicators & Scroll Indicator */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2.5">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`relative h-[2px] overflow-hidden transition-all duration-500 ${
                    activeSlide === idx ? 'w-16 bg-white/25' : 'w-6 bg-white/30 hover:bg-white/60'
                  }`}
                >
                  {activeSlide === idx && (
                    <motion.span
                      key={`progress-${activeSlide}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6.5, ease: 'linear' }}
                      className="block h-full bg-[#C5A059]"
                    />
                  )}
                </button>
              ))}
            </div>

            <a
              href="#buy-section"
              className="hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-white/75 hover:text-[#C5A059] transition-colors"
            >
              <span>Scroll to Explore</span>
              <span className="w-[1px] h-7 bg-white/20 overflow-hidden relative inline-block">
                <span className="w-full h-3 bg-[#C5A059] block animate-scroll-drop" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== INFINITE LUXURY TICKER MARQUEE ==================== */}
      <div
        className={`py-4 border-b overflow-hidden ${
          isDark
            ? 'bg-[#070707] border-neutral-800 text-neutral-300'
            : 'bg-[#111111] border-neutral-800 text-neutral-200'
        }`}
      >
        <div className="animate-marquee flex items-center gap-12">
          {[...MARQUEE_DEVELOPMENTS, ...MARQUEE_DEVELOPMENTS].map((label, idx) => (
            <div key={idx} className="flex items-center gap-4 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 2. EDITORIAL INTRO + ANIMATED LUXURY METRICS ==================== */}
      <section className={`py-24 border-b ${dividerColor}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-16">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            <div className="lg:col-span-5">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold block mb-3">
                THE DUBAI LUXURY PROPERTY PORTAL
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-normal leading-[1.15] tracking-tight">
                Discover exceptional luxury homes in Dubai.
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-[2px] bg-[#C5A059] mt-6"
              />
            </div>

            <div className={`lg:col-span-7 space-y-5 text-sm sm:text-base leading-relaxed font-light ${mutedText}`}>
              <p>
                <strong className={isDark ? 'text-white font-semibold' : 'text-neutral-900 font-semibold'}>
                  MGN MARKETING
                </strong>{' '}
                is Dubai&apos;s leading luxury property portal and private real estate brokerage,
                connecting buyers with exceptional villas, penthouses, and apartments in the
                city&apos;s most sought-after locations, including Palm Jumeirah, Emirates Hills,
                Al Barari, and Downtown Dubai. We carefully select and rigorously vet our
                portfolio, focusing on outstanding architecture, design, quality, and location.
              </p>
              <p>
                Led by Founders &amp; Managing Partners{' '}
                <strong className={isDark ? 'text-white font-semibold' : 'text-neutral-900 font-semibold'}>
                  Gul Nawaz
                </strong>{' '}
                and{' '}
                <strong className={isDark ? 'text-white font-semibold' : 'text-neutral-900 font-semibold'}>
                  Jibran Khan
                </strong>
                , MGN Marketing works alongside Dubai&apos;s most reputable master developers to
                offer privileged access to trophy homes across the market.
              </p>
            </div>
          </motion.div>

          {/* Animated Staggered Metrics Bar */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t ${dividerColor}`}>
            {[
              { value: 'AED 605M+', label: 'Combined Partner Sales Volume' },
              { value: '0% Tax', label: 'UAE Income & Capital Gains Tax' },
              { value: '8.5% – 12%', label: 'Average Net Rental Yield' },
              { value: '10-Year', label: 'UAE Golden Visa Advisory' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                className={`p-5 border transition-colors ${
                  isDark
                    ? 'bg-[#0E0E0E] border-neutral-800/80 hover:border-[#C5A059]/50'
                    : 'bg-[#FAF9F6] border-neutral-200/80 hover:border-[#C5A059]'
                } space-y-1`}
              >
                <p className="font-display text-3xl sm:text-4xl font-normal gold-shimmer">
                  {stat.value}
                </p>
                <span className={`text-xs uppercase tracking-[0.16em] block ${mutedText}`}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. LUXHABITAT-STYLE FEATURED LISTINGS GRID ==================== */}
      <section id="buy-section" className="py-24 max-w-[1400px] mx-auto px-4 sm:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
              CURATED SALES PORTFOLIO
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal mt-1">
              Prime Residences for Sale
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2.5 border text-xs transition-colors ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white focus-within:border-[#C5A059]'
                  : 'bg-white border-neutral-300 text-neutral-900 focus-within:border-neutral-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#B89B5E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by community, tower or ref..."
                className="bg-transparent focus:outline-none w-56"
              />
            </div>
          </div>
        </motion.div>

        {/* Animated Location Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-14">
          {COMMUNITIES.map((comm) => {
            const active = selectedCommunity === comm;
            return (
              <motion.button
                key={comm}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCommunity(comm)}
                className={`relative px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors z-10 ${
                  active
                    ? isDark
                      ? 'text-neutral-950 border-[#C5A059] font-semibold'
                      : 'text-white border-neutral-900 font-semibold'
                    : isDark
                    ? 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeCommunityFilter"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className={`absolute inset-0 -z-10 shadow-md ${
                      isDark ? 'bg-[#C5A059]' : 'bg-neutral-900'
                    }`}
                  />
                )}
                {comm}
              </motion.button>
            );
          })}
        </div>

        {/* Luxhabitat-Style 3-Column Property Grid with Smooth Hover & Sheen Animations */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <AnimatePresence>
            {filteredProperties.map((property, idx) => {
              const isFollowed = !!followedIds[property._id];
              const followersCount = (idx % 5) + (isFollowed ? 1 : 0);

              return (
                <motion.article
                  key={property._id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  onClick={() => onSelectProperty(property)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Architectural Image Container with Luxury Sheen Sweep */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 mb-5 luxury-sheen">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Top Left Tag: Featured / New to market */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold bg-white/95 text-neutral-950 shadow-sm">
                          {property.featured ? 'Featured' : 'New to market'}
                        </span>
                      </div>

                      {/* Top Right Follow / Save Heart */}
                      <button
                        type="button"
                        onClick={(e) => toggleFollow(property._id, e)}
                        className="absolute top-3.5 right-3.5 w-9 h-9 bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform active:scale-125 ${
                            isFollowed ? 'fill-[#B89B5E] text-[#B89B5E]' : 'text-white'
                          }`}
                        />
                      </button>

                      {/* Hover Quick-Inspect Badge */}
                      <div className="absolute bottom-3.5 right-3.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="px-3 py-1.5 bg-[#C5A059] text-neutral-950 text-[10px] font-bold uppercase tracking-[0.16em] flex items-center gap-1">
                          View Residence <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Community & Sub-Development Title */}
                    <div className="space-y-1">
                      <h3 className="font-display text-2xl font-normal group-hover:text-[#B89B5E] transition-colors">
                        {property.community}
                      </h3>
                      <p className={`text-xs uppercase tracking-[0.14em] ${mutedText}`}>
                        {property.developer} • {property.referenceCode}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-3 text-lg font-semibold tracking-wide">
                      {formatCurrency(property.priceAED, currency)}
                    </div>

                    {/* Specs Bullet Row */}
                    <div
                      className={`mt-2 flex items-center gap-2.5 text-xs py-2.5 border-y ${dividerColor} ${mutedText}`}
                    >
                      <span>{property.propertyType}</span>
                      <span>•</span>
                      <span>{property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{property.areaSqFt.toLocaleString('en-US')} sq. ft.</span>
                    </div>

                    {/* Presented By & Views / Followers */}
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className={mutedText}>
                        Presented by{' '}
                        <strong className={isDark ? 'text-neutral-200' : 'text-neutral-800'}>
                          {property.assignedAgentName || 'MGN Marketing'}
                        </strong>
                      </span>
                      <span className={`flex items-center gap-2 ${mutedText}`}>
                        <Eye className="w-3.5 h-3.5" />
                        {property.viewsCount || 18} Views • {followersCount} Followers
                      </span>
                    </div>

                    {/* Headline & 2-Line Editorial Excerpt */}
                    <div className="mt-4 space-y-1">
                      <h4 className="text-sm font-semibold line-clamp-1">{property.title}</h4>
                      <p className={`text-xs leading-relaxed line-clamp-2 font-light ${mutedText}`}>
                        {property.description}
                      </p>
                    </div>
                  </div>

                  {/* Direct Email & WhatsApp Bar */}
                  <div className="grid grid-cols-2 gap-2.5 mt-5 pt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickInquiry(
                          `Email Inquiry for ${property.title} (${property.referenceCode}) in ${property.community}`
                        );
                      }}
                      className={`py-2.5 px-4 border text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isDark
                          ? 'border-neutral-800 hover:bg-white hover:text-neutral-950'
                          : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>

                    <a
                      href={`https://wa.me/${(property.assignedAgentPhone || '+971508429910').replace(
                        /[^0-9]/g,
                        ''
                      )}?text=${encodeURIComponent(
                        `Hello MGN Marketing, I am interested in ${property.title} (${property.referenceCode}) in ${property.community}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`py-2.5 px-4 border text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors ${
                        isDark
                          ? 'border-neutral-800 hover:bg-[#B89B5E] hover:text-neutral-950 hover:border-[#B89B5E]'
                          : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ==================== 4. CURATED COLLECTION OF LUXURY RENTALS ==================== */}
      <section
        id="rentals-section"
        className={`py-24 border-y ${
          isDark ? 'bg-[#0D0D0D] border-neutral-800' : 'bg-[#F8F7F4] border-neutral-200'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14"
          >
            <div className="lg:col-span-6">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
                ANNUAL &amp; SHORT-TERM RESIDENCES
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-normal mt-2">
                Curated collection of luxury rentals
              </h2>
            </div>
            <div className={`lg:col-span-6 text-sm leading-relaxed font-light ${mutedText}`}>
              Explore Dubai&apos;s most exclusive luxury rentals, from elegant penthouses and
              designer apartments to private villas for rent. Discover curated residences in
              Marina, JBR, Downtown, Al Barari, Dubai Hills, Palm Jumeirah, MBR City, and
              Bluewaters — offering both annual leases and turnkey short-term stays.
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LUXURY_RENTAL_SHOWCASE.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`border p-5 flex flex-col justify-between transition-all ${cardSurface}`}
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden mb-5 luxury-sheen">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold bg-white text-neutral-950">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-normal">{item.community}</h3>
                  <p className={`text-xs uppercase tracking-[0.14em] mt-0.5 ${mutedText}`}>
                    {item.subCommunity}
                  </p>

                  <div className="mt-3 text-lg font-semibold">
                    {formatCurrency(item.priceAED, currency)}{' '}
                    <span className={`text-xs font-normal ${mutedText}`}>per year</span>
                  </div>

                  <div
                    className={`mt-2 flex items-center gap-2.5 text-xs py-2.5 border-y ${dividerColor} ${mutedText}`}
                  >
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.beds} beds</span>
                    <span>•</span>
                    <span>{item.sqft.toLocaleString('en-US')} sq. ft.</span>
                  </div>

                  <div className="mt-3 text-[11px] flex justify-between">
                    <span className={mutedText}>Presented by MGN Luxury Leasing</span>
                    <span className={mutedText}>
                      {item.views} Views • {item.followers} Followers
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold mt-4 line-clamp-1">{item.headline}</h4>
                  <p className={`text-xs leading-relaxed mt-1 line-clamp-2 font-light ${mutedText}`}>
                    {item.excerpt}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-5 pt-3">
                  <button
                    onClick={() =>
                      onOpenQuickInquiry(
                        `Luxury Rental Inquiry: ${item.headline} in ${item.community}`
                      )
                    }
                    className={`py-2.5 px-4 border text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isDark
                        ? 'border-neutral-800 hover:bg-white hover:text-neutral-950'
                        : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <a
                    href="https://wa.me/971508429910"
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2.5 px-4 border text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isDark
                        ? 'border-neutral-800 hover:bg-[#B89B5E] hover:text-neutral-950'
                        : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. ICONIC DEVELOPMENTS & PARTNER SHOWCASE ==================== */}
      <section id="developments-section" className={`py-24 border-b ${dividerColor}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mb-12"
          >
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
              MASTER DEVELOPERS &amp; BRANDED RESIDENCES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal mt-2">
              Iconic Dubai Developments
            </h2>
            <p className={`text-sm mt-3 leading-relaxed font-light ${mutedText}`}>
              MGN Marketing works with Dubai&apos;s most respected developers and luxury hospitality
              brands to showcase architectural trophy assets to a global audience of high-net-worth
              buyers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Bulgari Lighthouse',
                location: 'Jumeirah Bay Island',
                price: 'From AED 65,000,000',
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'Bugatti Residences',
                location: 'Business Bay',
                price: 'From AED 19,500,000',
                img: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'The Alba Dorchester',
                location: 'Palm Jumeirah',
                price: 'From AED 33,000,000',
                img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=900&q=80',
              },
              {
                name: 'One Za’abeel The Residences',
                location: 'DIFC & Downtown',
                price: 'From AED 11,800,000',
                img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80',
              },
            ].map((dev, idx) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() =>
                  onOpenQuickInquiry(
                    `Requesting brochure & unit availability for ${dev.name} (${dev.location})`
                  )
                }
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer bg-neutral-950 luxury-sheen"
              >
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] block">
                    {dev.location}
                  </span>
                  <h3 className="font-display text-2xl font-normal mt-1 flex items-center justify-between">
                    <span>{dev.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#C5A059]" />
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">{dev.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. EDITOR'S PICKS (LUXHABITAT EDITORIAL NARRATIVE) ==================== */}
      <section id="editors-picks" className={`py-24 border-b ${dividerColor}`}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-[1400px] mx-auto px-4 sm:px-8"
        >
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
              ARCHITECTURAL CURATION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal mt-2">
              Editor&apos;s Picks: A curated selection of luxury real estate in Dubai
            </h2>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 text-sm leading-relaxed font-light ${mutedText}`}
          >
            <div className="space-y-4">
              <p>
                Explore a handpicked collection of exceptional luxury homes across Dubai&apos;s most
                sought-after neighbourhoods. Every property featured in MGN Marketing&apos;s
                Editor&apos;s Picks has been carefully selected for its architectural quality,
                craftsmanship, design, location, and long-term capital appeal.
              </p>
              <p>
                Our collection of{' '}
                <strong className={isDark ? 'text-white' : 'text-neutral-900'}>
                  luxury villas
                </strong>{' '}
                includes beachfront homes on Palm Jumeirah, golf course estates in Emirates Hills
                and Jumeirah Golf Estates, contemporary family residences in Dubai Hills and Tilal
                Al Ghaf, waterfront villas in Palm Jebel Ali, and nature-inspired homes in Al
                Barari.
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Our selection of{' '}
                <strong className={isDark ? 'text-white' : 'text-neutral-900'}>
                  luxury apartments &amp; penthouses
                </strong>{' '}
                features Dubai&apos;s most desirable addresses, including Bluewaters, Business Bay,
                DIFC, Downtown Dubai, Dubai Creek Harbour, Dubai Harbour, Dubai Marina, and Emaar
                Beachfront.
              </p>
              <p>
                Dubai&apos;s luxury market is defined by iconic residential developments such as
                Bulgari Residences on Jumeirah Bay Island, Atlantis The Royal Residences, Burj
                Khalifa, Muraba Veil, Bugatti Residences by Binghatti, One Za&apos;abeel, and The
                Lana Residences — representing the highest standards of branded waterfront living.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== 7. WHAT OUR CLIENTS SAY & OWNERS / PARTNERS ==================== */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-8 space-y-24">
        {/* Testimonials */}
        <div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal mt-2">
              What our clients say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CLIENT_TESTIMONIALS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className={`p-8 border flex flex-col justify-between ${cardSurface}`}
              >
                <div className="space-y-4">
                  <Quote className="w-6 h-6 text-[#B89B5E]" />
                  <p className={`text-sm leading-relaxed font-light italic ${mutedText}`}>
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className={`mt-6 pt-4 border-t ${dividerColor}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em]">
                    — {item.author}
                  </p>
                  <span className={`text-[11px] ${mutedText}`}>{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Owners & Partners (Gul Nawaz & Jibran Khan) */}
        <div id="owners-partners" className="space-y-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold">
                EXECUTIVE LEADERSHIP &amp; FOUNDERS
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-normal mt-2">
                Owners &amp; Partners
              </h2>
            </div>
            <p className={`text-sm max-w-lg font-light leading-relaxed ${mutedText}`}>
              Founded and led by{' '}
              <strong className={isDark ? 'text-white' : 'text-neutral-900'}>Gul Nawaz</strong> and{' '}
              <strong className={isDark ? 'text-white' : 'text-neutral-900'}>Jibran Khan</strong> —
              delivering bespoke Dubai real estate advisory, master developer allocations, and
              private portfolio management.
            </p>
          </motion.div>

          {/* 2-Card Executive Showcase for Gul Nawaz & Jibran Khan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {agents.slice(0, 2).map((agent, idx) => {
              const partnerBadge =
                idx === 0
                  ? 'Founder, Owner & Managing Partner'
                  : 'Co-Founder, Owner & Managing Partner';

              return (
                <motion.div
                  key={agent._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className={`group border overflow-hidden transition-all duration-300 flex flex-col justify-between ${cardSurface}`}
                >
                  <div>
                    {/* Portrait Image with Luxury Sheen */}
                    <div className="relative aspect-[4/4] overflow-hidden bg-neutral-900 luxury-sheen">
                      <img
                        src={agent.avatar}
                        alt={agent.fullName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold bg-[#B89B5E] text-neutral-950 shadow">
                          {partnerBadge}
                        </span>
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] block">
                          DLD RERA • {agent.reraBrn}
                        </span>
                        <h3 className="font-display text-3xl font-normal mt-0.5">
                          {agent.fullName}
                        </h3>
                        <p className="text-xs text-neutral-300 mt-0.5">{agent.role}</p>
                      </div>
                    </div>

                    {/* Partner Portfolio Metrics */}
                    <div className="p-6 space-y-3 text-xs">
                      <p className={`font-light leading-relaxed ${mutedText}`}>
                        Specializing in {agent.specialization}
                      </p>
                      <div className={`pt-3 border-t ${dividerColor} space-y-2`}>
                        <div className="flex justify-between">
                          <span className={mutedText}>Portfolio Volume:</span>
                          <span className="font-semibold text-[#B89B5E]">
                            {formatCurrency(agent.totalSalesVolumeAED, currency, true)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mutedText}>Transactions Closed:</span>
                          <span className="font-semibold">{agent.dealsClosed} Deals</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={mutedText}>Languages:</span>
                          <span>{agent.languages?.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Partner Contact */}
                  <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        onOpenQuickInquiry(
                          `Direct Partner Consultation with ${agent.fullName} (${partnerBadge})`
                        )
                      }
                      className={`py-3 border text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors ${
                        isDark
                          ? 'border-neutral-800 hover:bg-white hover:text-neutral-950'
                          : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      Inquire
                    </button>
                    <a
                      href={`https://wa.me/${(agent.whatsapp || '+971508429910').replace(
                        /[^0-9]/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`py-3 border text-[11px] uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isDark
                          ? 'border-neutral-800 hover:bg-[#B89B5E] hover:text-neutral-950 hover:border-[#B89B5E]'
                          : 'border-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Official Developer & Institutional Partners Grid */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`p-8 border ${cardSurface}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#B89B5E] font-semibold block">
                  OFFICIAL DEVELOPER &amp; AGENCY ALLIANCES
                </span>
                <h3 className="font-display text-2xl font-normal mt-1">
                  Our Strategic Partners in Dubai
                </h3>
              </div>
              <button
                onClick={() =>
                  onOpenQuickInquiry(
                    'Owner / Landlord Property Listing or Strategic Partnership Inquiry'
                  )
                }
                className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold border transition-colors ${
                  isDark
                    ? 'border-[#B89B5E] text-[#B89B5E] hover:bg-[#B89B5E] hover:text-neutral-950'
                    : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                Partner With MGN Marketing
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'EMAAR', sub: 'Master Developer' },
                { name: 'OMNIYAT', sub: 'Ultra-Prime Partner' },
                { name: 'BINGHATTI', sub: 'Branded Residences' },
                { name: 'NAKHEEL', sub: 'Waterfront Masterplan' },
                { name: 'MERAAS', sub: 'Lifestyle Destinations' },
                { name: 'SOBHA REALTY', sub: 'Luxury Estates' },
              ].map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ y: -3 }}
                  className={`p-4 border text-center transition-colors ${
                    isDark
                      ? 'bg-neutral-950/60 border-neutral-800 hover:border-[#B89B5E]/50'
                      : 'bg-[#F8F7F4] border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <p className="font-display font-bold text-sm tracking-[0.18em]">{p.name}</p>
                  <span className={`text-[10px] uppercase tracking-wider block mt-1 ${mutedText}`}>
                    {p.sub}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
