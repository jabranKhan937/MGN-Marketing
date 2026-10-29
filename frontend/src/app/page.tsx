'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroShowcase from '@/components/HeroShowcase';
import RoiMortgageCalculator from '@/components/RoiMortgageCalculator';
import PropertyDetailModal from '@/components/PropertyDetailModal';
import ManagementPortal from '@/components/ManagementPortal';
import ClientLeadsWorkspace from '@/components/ClientLeadsWorkspace';
import {
  Property,
  Lead,
  Deal,
  Agent,
  Campaign,
  Viewing,
  OverviewAnalytics,
} from '@/types';
import { CurrencyCode, apiRequest } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'showcase' | 'clients' | 'portal'>('showcase');
  const [currency, setCurrency] = useState<CurrencyCode>('AED');
  // Default to MGN Marketing's signature luxury dark theme (can toggle to Light anytime)
  const [isDark, setIsDark] = useState(true);

  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [overview, setOverview] = useState<OverviewAnalytics | null>(null);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [quickInquiryOpen, setQuickInquiryOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: 'United Kingdom',
    budgetAED: 8000000,
    interestedCommunity: 'Palm Jumeirah',
  });
  const [inquirySent, setInquirySent] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      const [propsData, leadsData, dealsData, agentsData, campsData, viewsData, overviewData] =
        await Promise.all([
          apiRequest<Property[]>('/properties'),
          apiRequest<Lead[]>('/leads'),
          apiRequest<Deal[]>('/operations/deals'),
          apiRequest<Agent[]>('/operations/agents'),
          apiRequest<Campaign[]>('/operations/campaigns'),
          apiRequest<Viewing[]>('/operations/viewings'),
          apiRequest<OverviewAnalytics>('/operations/overview'),
        ]);
      setProperties(propsData);
      setLeads(leadsData);
      setDeals(dealsData);
      setAgents(agentsData);
      setCampaigns(campsData);
      setViewings(viewsData);
      setOverview(overviewData);
    } catch (err) {
      console.error('Error loading MGN data:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  const handleOpenQuickInquiry = (note = '') => {
    setQuickNote(note);
    setInquirySent(false);
    setQuickInquiryOpen(true);
  };

  const handleQuickInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...inquiryForm,
          purpose: 'Investment / High ROI',
          priority: 'VIP / High',
          source: 'Website VIP Concierge',
          notes: quickNote || 'Direct Private Office inquiry.',
        }),
      });
      setInquirySent(true);
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#0A0A0A] text-neutral-100' : 'bg-white text-neutral-900'
      }`}
    >
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currency={currency}
        setCurrency={setCurrency}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenQuickInquiry={() => handleOpenQuickInquiry()}
      />

      <AnimatePresence mode="wait">
        {activeView === 'showcase' ? (
          <motion.main
            key="showcase"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroShowcase
              properties={properties}
              agents={agents}
              currency={currency}
              isDark={isDark}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onOpenPortal={() => setActiveView('portal')}
              onOpenClients={() => setActiveView('clients')}
              onOpenQuickInquiry={handleOpenQuickInquiry}
            />

            <RoiMortgageCalculator
              currency={currency}
              isDark={isDark}
              onRequestAdvisory={(summary) => handleOpenQuickInquiry(summary)}
            />
          </motion.main>
        ) : activeView === 'clients' ? (
          <motion.main
            key="clients"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ClientLeadsWorkspace
              leads={leads}
              agents={agents}
              properties={properties}
              currency={currency}
              isDark={isDark}
              onRefreshAll={fetchAllData}
            />
          </motion.main>
        ) : (
          <motion.main
            key="portal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ManagementPortal
              overview={overview}
              properties={properties}
              leads={leads}
              deals={deals}
              agents={agents}
              campaigns={campaigns}
              viewings={viewings}
              currency={currency}
              isDark={isDark}
              onRefreshAll={fetchAllData}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Floating Private Concierge Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => handleOpenQuickInquiry('VIP Private Concierge Consultation')}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-[#111111] text-white border border-[#C5A059]/60 shadow-2xl flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[#C5A059] hover:text-neutral-950 transition-colors animate-gold-pulse"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-neutral-950" />
        <span>VIP Concierge</span>
      </motion.button>

      {/* Property Detail & Instant CRM Lead Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
        onLeadSubmitted={fetchAllData}
      />

      {/* Quick VIP Consultation Modal */}
      <AnimatePresence>
        {quickInquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQuickInquiryOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg border p-8 relative shadow-2xl ${
                isDark
                  ? 'bg-[#111111] border-neutral-800 text-white'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
            <button
              onClick={() => setQuickInquiryOpen(false)}
              className="absolute top-5 right-5 p-2 opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="/mgn-logo.png"
                alt="MGN Marketing"
                className="w-11 h-11 rounded-lg object-cover border border-[#B89B5E]/40"
              />
              <div>
                <div className="text-[#B89B5E] text-[10px] font-semibold uppercase tracking-[0.22em]">
                  MGN Marketing Private Client Office
                </div>
                <h3 className="font-display text-2xl font-normal">
                  Private Property Inquiry
                </h3>
              </div>
            </div>

            {inquirySent ? (
              <div className="p-6 border border-emerald-500/30 bg-emerald-500/5 text-center space-y-2">
                <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto" />
                <h4 className="font-display text-lg">Inquiry Registered</h4>
                <p className="text-xs opacity-75">
                  Our Senior Private Client Advisor will contact you via WhatsApp or Email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickInquirySubmit} className="space-y-4">
                {quickNote && (
                  <div className="p-3 border border-[#B89B5E]/30 bg-[#B89B5E]/10 text-xs">
                    {quickNote}
                  </div>
                )}
                <input
                  required
                  placeholder="Full Name *"
                  value={inquiryForm.fullName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                  className={`w-full px-4 py-3 border text-sm focus:outline-none ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800'
                      : 'bg-[#F8F7F4] border-neutral-300'
                  }`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className={`w-full px-4 py-3 border text-sm focus:outline-none ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-[#F8F7F4] border-neutral-300'
                    }`}
                  />
                  <input
                    required
                    placeholder="Phone / WhatsApp *"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className={`w-full px-4 py-3 border text-sm focus:outline-none ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-[#F8F7F4] border-neutral-300'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={inquiryForm.interestedCommunity}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, interestedCommunity: e.target.value })
                    }
                    className={`w-full px-4 py-3 border text-sm focus:outline-none ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-[#F8F7F4] border-neutral-300'
                    }`}
                  >
                    <option>Palm Jumeirah</option>
                    <option>Downtown Dubai</option>
                    <option>Emirates Hills</option>
                    <option>Al Barari</option>
                    <option>Dubai Marina</option>
                    <option>Business Bay</option>
                    <option>Dubai Hills Estate</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Budget (AED)"
                    value={inquiryForm.budgetAED}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, budgetAED: Number(e.target.value) })
                    }
                    className={`w-full px-4 py-3 border text-sm focus:outline-none ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-[#F8F7F4] border-neutral-300'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDark
                      ? 'bg-[#B89B5E] text-neutral-950 hover:bg-[#c8aa6c]'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Submit Inquiry
                </button>
              </form>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== LUXHABITAT-STYLE ARCHITECTURAL FOOTER ==================== */}
      <footer className="bg-[#0A0A0A] text-neutral-400 border-t border-neutral-800 pt-16 pb-12 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/mgn-logo.png"
                  alt="MGN Marketing Logo"
                  className="w-12 h-12 rounded-lg object-cover border border-[#B89B5E]/40 shrink-0"
                />
                <div>
                  <span className="font-display font-bold text-lg tracking-[0.16em] text-white block">
                    MGN MARKETING
                  </span>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#B89B5E] block">
                    DUBAI LUXURY REAL ESTATE
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-neutral-400 max-w-sm font-light">
                Connecting discerning global buyers and tenants with Dubai&apos;s finest luxury
                villas, penthouses, waterfront mansions, and architectural developments.
              </p>
              <p className="text-[11px] text-neutral-500">
                Boulevard Plaza Tower 1, Level 24, Downtown Dubai, UAE • RERA ORN #31940
              </p>
            </div>

            {/* Luxury Villas */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white mb-3">
                Luxury Villas
              </h4>
              <ul className="space-y-2 text-neutral-400">
                <li>Palm Jumeirah Villas</li>
                <li>Emirates Hills Estates</li>
                <li>Al Barari Botanical Villas</li>
                <li>Dubai Hills Golf Mansions</li>
                <li>Palm Jebel Ali Fronds</li>
                <li>Jumeirah Bay Island</li>
              </ul>
            </div>

            {/* Penthouses & Developments */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white mb-3">
                Iconic Developments
              </h4>
              <ul className="space-y-2 text-neutral-400">
                <li>Muraba Veil Residences</li>
                <li>Atlantis The Royal</li>
                <li>Bulgari Lighthouse</li>
                <li>Bugatti Residences</li>
                <li>The Lana Dorchester</li>
                <li>One Za&apos;abeel</li>
              </ul>
            </div>

            {/* MGN Platform Links */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white mb-3">
                MGN Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveView('showcase')}
                    className="hover:text-white transition-colors"
                  >
                    Luxury Showroom
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('clients')}
                    className="hover:text-white transition-colors"
                  >
                    Clients &amp; Leads Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('portal')}
                    className="hover:text-white transition-colors"
                  >
                    Enterprise Business OS
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenQuickInquiry()}
                    className="hover:text-white transition-colors"
                  >
                    List Your Property
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <span>
              © {new Date().getFullYear()} MGN Marketing Dubai Real Estate LLC. All rights reserved.
            </span>
            <span>DLD &amp; RERA Certified Luxury Property Portal • Dubai, UAE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
