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
import { Sparkles, X, Send, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'showcase' | 'clients' | 'portal'>('showcase');
  const [currency, setCurrency] = useState<CurrencyCode>('AED');
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
    interestedCommunity: 'Downtown Dubai',
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
          notes: quickNote || 'Direct VIP Advisory consultation request.',
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
        isDark ? 'bg-[#070A12] text-slate-100' : 'bg-[#FAF7F0] text-slate-900'
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

      {activeView === 'showcase' ? (
        <main>
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
        </main>
      ) : activeView === 'clients' ? (
        <main>
          <ClientLeadsWorkspace
            leads={leads}
            agents={agents}
            properties={properties}
            currency={currency}
            isDark={isDark}
            onRefreshAll={fetchAllData}
          />
        </main>
      ) : (
        <main>
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
        </main>
      )}

      {/* Property Detail & Instant CRM Lead Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
        onLeadSubmitted={fetchAllData}
      />

      {/* Quick VIP Consultation Modal */}
      {quickInquiryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setQuickInquiryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-950 border border-amber-500/40 p-7 text-white relative shadow-2xl"
          >
            <button
              onClick={() => setQuickInquiryOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <img
                src="/mgn-logo.png"
                alt="MGN Marketing"
                className="w-11 h-11 rounded-xl object-cover border border-amber-500/40"
              />
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  MGN Marketing Private Client Desk
                </div>
                <h3 className="font-display text-xl font-bold">
                  Book Private Dubai Investment Advisory
                </h3>
              </div>
            </div>

            {inquirySent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg">VIP Consultation Logged in MGN CRM</h4>
                <p className="text-xs text-slate-300">
                  Our Senior RERA Partner will reach out via WhatsApp/Phone within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickInquirySubmit} className="space-y-3.5">
                {quickNote && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                    {quickNote}
                  </div>
                )}
                <input
                  required
                  placeholder="Full Name *"
                  value={inquiryForm.fullName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm"
                  />
                  <input
                    required
                    placeholder="Phone / WhatsApp *"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={inquiryForm.interestedCommunity}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, interestedCommunity: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm"
                  >
                    <option>Downtown Dubai</option>
                    <option>Palm Jumeirah</option>
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
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit to MGN Executive Desk
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Luxury Footer */}
      <footer
        className={`border-t py-12 mt-16 text-xs ${
          isDark
            ? 'bg-slate-950 border-slate-800/80 text-slate-400'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing Logo"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shrink-0"
            />
            <div>
              <span className="font-display font-bold text-base gold-shimmer">
                MGN MARKETING DUBAI REAL ESTATE LLC
              </span>
              <p className="mt-0.5 opacity-75">
                Owners & Managing Partners: <strong>Gul Nawaz</strong> & <strong>Jibran Khan</strong> • Downtown Dubai, UAE • RERA ORN #31940
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveView('showcase')} className="hover:text-amber-400">
              Public Showcase
            </button>
            <button onClick={() => setActiveView('clients')} className="hover:text-amber-400">
              Clients & Leads
            </button>
            <button onClick={() => setActiveView('portal')} className="hover:text-amber-400">
              Enterprise Business OS
            </button>
            <span>© {new Date().getFullYear()} MGN Marketing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
