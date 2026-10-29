'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Building2,
  Users,
  Briefcase,
  Megaphone,
  Calendar,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import {
  Property,
  Lead,
  Deal,
  Agent,
  Campaign,
  Viewing,
  OverviewAnalytics,
} from '@/types';
import { CurrencyCode, formatCurrency, apiRequest } from '@/lib/api';
import ClientLeadsWorkspace from '@/components/ClientLeadsWorkspace';

interface ManagementPortalProps {
  overview: OverviewAnalytics | null;
  properties: Property[];
  leads: Lead[];
  deals: Deal[];
  agents: Agent[];
  campaigns: Campaign[];
  viewings: Viewing[];
  currency: CurrencyCode;
  isDark: boolean;
  onRefreshAll: () => Promise<void>;
}

type PortalTab = 'overview' | 'properties' | 'leads' | 'deals' | 'campaigns' | 'viewings';

export default function ManagementPortal({
  overview,
  properties,
  leads,
  deals,
  agents,
  campaigns,
  viewings,
  currency,
  isDark,
  onRefreshAll,
}: ManagementPortalProps) {
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');
  const [busy, setBusy] = useState(false);

  // New Property Form State
  const [showPropModal, setShowPropModal] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '',
    subtitle: 'Signature Luxury Residence in Dubai',
    community: 'Downtown Dubai',
    developer: 'Emaar Properties',
    propertyType: 'Penthouse',
    listingType: 'Off-Plan',
    priceAED: 8500000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqFt: 2850,
    roiEstimate: 8.8,
    completionYear: 'Q4 2027',
    assignedAgentName: 'Tariq Al-Mansoori',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  });

  // New Lead Form State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: 'United Kingdom',
    budgetAED: 10000000,
    interestedCommunity: 'Palm Jumeirah',
    purpose: 'Investment / High ROI',
    priority: 'VIP / High',
    assignedAgent: 'Tariq Al-Mansoori',
    source: 'Instagram Luxury Ads',
  });

  // New Deal Form State
  const [showDealModal, setShowDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    propertyTitle: '',
    community: 'Downtown Dubai',
    developer: 'Emaar Properties',
    buyerName: '',
    buyerNationality: 'Switzerland',
    agentName: 'Tariq Al-Mansoori',
    dealType: 'Off-Plan Developer Sale',
    saleValueAED: 14500000,
    commissionPercent: 4,
    agentSplitPercent: 50,
    dldFeeStatus: '4% DLD Paid + Oqood Issued',
    status: 'SPA Signed',
  });

  // New Campaign Form State
  const [showCampModal, setShowCampModal] = useState(false);
  const [newCamp, setNewCamp] = useState({
    campaignName: '',
    channel: 'Instagram & Meta Luxury',
    targetCommunity: 'Palm Jumeirah',
    targetAudience: 'UK & EU HNW Investors',
    budgetAED: 120000,
    spendAED: 65000,
    leadsGenerated: 48,
    dealsAttributed: 2,
    revenueAttributedAED: 920000,
  });

  // New Viewing Form State
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [newViewing, setNewViewing] = useState({
    clientName: '',
    clientPhone: '+971 50 000 0000',
    clientEmail: 'vip@investor.com',
    propertyTitle: 'Burj Crown Sky Penthouse',
    community: 'Downtown Dubai',
    agentName: 'Tariq Al-Mansoori',
    viewingType: 'In-Person VIP Chauffeur',
    scheduledDate: '2026-11-05',
    scheduledTime: '16:00 GST',
    notes: 'Pick up from Four Seasons DIFC.',
  });

  const kpis = overview?.kpis;

  // Handlers
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/properties', {
        method: 'POST',
        body: JSON.stringify({
          ...newProp,
          description: `${newProp.title} by ${newProp.developer} in ${newProp.community}. High-yield luxury Dubai asset managed exclusively by MGN Marketing.`,
          goldenVisaEligible: Number(newProp.priceAED) >= 2000000,
          paymentPlan: {
            downPayment: 20,
            duringConstruction: 40,
            onHandover: 40,
            postHandover: 0,
            summary: '60/40 Developer Plan',
          },
          amenities: ['Private Infinity Pool', '24/7 Concierge', 'Valet Parking', 'Smart Home OS'],
          images: [newProp.image],
        }),
      });
      setShowPropModal(false);
      await onRefreshAll();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePropertyStatus = async (id: string, status: string) => {
    await apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    await onRefreshAll();
  };

  const handleDeleteProperty = async (id: string) => {
    await apiRequest(`/properties/${id}`, { method: 'DELETE' });
    await onRefreshAll();
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify(newLead),
      });
      setShowLeadModal(false);
      await onRefreshAll();
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateLeadStage = async (id: string, stage: string) => {
    await apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stage }),
    });
    await onRefreshAll();
  };

  const handleDeleteLead = async (id: string) => {
    await apiRequest(`/leads/${id}`, { method: 'DELETE' });
    await onRefreshAll();
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/operations/deals', {
        method: 'POST',
        body: JSON.stringify(newDeal),
      });
      setShowDealModal(false);
      await onRefreshAll();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/operations/campaigns', {
        method: 'POST',
        body: JSON.stringify(newCamp),
      });
      setShowCampModal(false);
      await onRefreshAll();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/operations/viewings', {
        method: 'POST',
        body: JSON.stringify(newViewing),
      });
      setShowViewingModal(false);
      await onRefreshAll();
    } finally {
      setBusy(false);
    }
  };

  const cardClass = isDark
    ? 'bg-slate-900/80 border-slate-800 text-white'
    : 'bg-white border-amber-200/80 text-slate-900 shadow-md';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Portal Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/mgn-logo.png"
            alt="MGN Marketing"
            className="w-14 h-14 rounded-2xl object-cover border border-amber-500/40 shadow-lg shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              MGN Marketing • Unified Dubai Real Estate ERP & CRM
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Enterprise <span className="gold-shimmer">Business Command Center</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefreshAll}
            className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500 hover:text-slate-950 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Live MongoDB
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-slate-800/60">
        {[
          { id: 'overview', label: 'Executive Analytics', icon: BarChart3 },
          { id: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
          { id: 'leads', label: `CRM Leads (${leads.length})`, icon: Users },
          { id: 'deals', label: `Deals & Commissions (${deals.length})`, icon: Briefcase },
          { id: 'campaigns', label: `Marketing ROAS (${campaigns.length})`, icon: Megaphone },
          { id: 'viewings', label: `VIP Viewings (${viewings.length})`, icon: Calendar },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as PortalTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                  : isDark
                  ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-500/40'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: EXECUTIVE ANALYTICS ==================== */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <span className="text-xs uppercase tracking-wider opacity-60">Active Portfolio Value</span>
              <p className="text-3xl font-display font-bold text-amber-400 mt-2">
                {formatCurrency(kpis?.totalPortfolioValueAED || 0, currency, true)}
              </p>
              <span className="text-xs text-emerald-400 mt-1 block">
                {kpis?.availableProperties || properties.length} Active Dubai Listings
              </span>
            </div>

            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <span className="text-xs uppercase tracking-wider opacity-60">Closed Sales Volume</span>
              <p className="text-3xl font-display font-bold text-emerald-400 mt-2">
                {formatCurrency(kpis?.totalSalesClosedAED || 0, currency, true)}
              </p>
              <span className="text-xs opacity-70 mt-1 block">
                Net MGN Revenue: {formatCurrency(kpis?.totalMgnNetRevenueAED || 0, currency, true)}
              </span>
            </div>

            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <span className="text-xs uppercase tracking-wider opacity-60">Active Investor Pipeline</span>
              <p className="text-3xl font-display font-bold mt-2">
                {formatCurrency(kpis?.totalPipelineBudgetAED || 0, currency, true)}
              </p>
              <span className="text-xs text-amber-400 mt-1 block">
                {kpis?.vipLeadsCount || 0} VIP High-Net-Worth Leads
              </span>
            </div>

            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <span className="text-xs uppercase tracking-wider opacity-60">Marketing Attribution ROAS</span>
              <p className="text-3xl font-display font-bold text-amber-400 mt-2">
                {kpis?.marketingRoas || 14.2}x Return
              </p>
              <span className="text-xs text-emerald-400 mt-1 block">
                Revenue: {formatCurrency(kpis?.totalMarketingRevenueAED || 0, currency, true)}
              </span>
            </div>
          </div>

          {/* Community Breakdown & Lead Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <h3 className="font-display text-xl font-bold mb-4">
                Portfolio Distribution by Dubai District
              </h3>
              <div className="space-y-4">
                {overview?.communityBreakdown?.map((c) => (
                  <div key={c.community} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>
                        {c.community} ({c.count} units)
                      </span>
                      <span className="text-amber-400">
                        {formatCurrency(c.totalValueAED, currency, true)} • {c.avgRoi}% ROI
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (c.totalValueAED / (kpis?.totalPortfolioValueAED || 1)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${cardClass}`}>
              <h3 className="font-display text-xl font-bold mb-4">CRM Pipeline Stage Velocity</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(overview?.stageCounts || {}).map(([stage, count]) => (
                  <div
                    key={stage}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <span className="text-xs opacity-70">{stage}</span>
                    <p className="text-2xl font-display font-bold text-amber-400 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================== TAB 2: PROPERTIES INVENTORY CRUD ==================== */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold">Dubai Property Inventory</h2>
            <button
              onClick={() => setShowPropModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Dubai Property
            </button>
          </div>

          {showPropModal && (
            <form onSubmit={handleCreateProperty} className={`p-6 rounded-3xl border ${cardClass} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <input
                required
                placeholder="Property Title (e.g., Armani Beach Villa)"
                value={newProp.title}
                onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <select
                value={newProp.community}
                onChange={(e) => setNewProp({ ...newProp, community: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              >
                <option>Downtown Dubai</option>
                <option>Palm Jumeirah</option>
                <option>Dubai Marina</option>
                <option>Business Bay</option>
                <option>Dubai Hills Estate</option>
                <option>Dubai Creek Harbour</option>
              </select>
              <input
                placeholder="Developer (e.g., Emaar, Omniyat)"
                value={newProp.developer}
                onChange={(e) => setNewProp({ ...newProp, developer: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Price in AED"
                value={newProp.priceAED}
                onChange={(e) => setNewProp({ ...newProp, priceAED: Number(e.target.value) })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Bedrooms"
                value={newProp.bedrooms}
                onChange={(e) => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  {busy ? 'Saving...' : 'Publish Listing'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPropModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-3xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Ref / Property</th>
                  <th className="p-4">Community</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">ROI</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {properties.map((p) => (
                  <tr key={p._id} className={isDark ? 'bg-slate-900/60' : 'bg-white'}>
                    <td className="p-4">
                      <span className="text-xs font-bold text-amber-400">{p.referenceCode}</span>
                      <p className="font-bold">{p.title}</p>
                      <span className="text-xs opacity-60">{p.developer}</span>
                    </td>
                    <td className="p-4 text-xs">{p.community}</td>
                    <td className="p-4 font-bold text-amber-400">
                      {formatCurrency(p.priceAED, currency)}
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">{p.roiEstimate}%</td>
                    <td className="p-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleUpdatePropertyStatus(p._id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Under Offer">Under Offer</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProperty(p._id)}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: CRM LEADS PIPELINE ==================== */}
      {activeTab === 'leads' && (
        <ClientLeadsWorkspace
          leads={leads}
          agents={agents}
          properties={properties}
          currency={currency}
          isDark={isDark}
          onRefreshAll={onRefreshAll}
        />
      )}

      {/* ==================== TAB 4: DEALS & COMMISSIONS ==================== */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold">DLD Transactions & Commission Ledger</h2>
            <button
              onClick={() => setShowDealModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Record New Deal
            </button>
          </div>

          {showDealModal && (
            <form onSubmit={handleCreateDeal} className={`p-6 rounded-3xl border ${cardClass} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <input
                required
                placeholder="Property Sold"
                value={newDeal.propertyTitle}
                onChange={(e) => setNewDeal({ ...newDeal, propertyTitle: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                required
                placeholder="Buyer Full Name"
                value={newDeal.buyerName}
                onChange={(e) => setNewDeal({ ...newDeal, buyerName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Sale Value (AED)"
                value={newDeal.saleValueAED}
                onChange={(e) => setNewDeal({ ...newDeal, saleValueAED: Number(e.target.value) })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <div className="flex gap-2 sm:col-span-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Log DLD Deal & Calculate Commission
                </button>
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {deals.map((d) => (
              <div key={d._id} className={`p-6 rounded-3xl border ${cardClass} space-y-3`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400">{d.dealCode}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                    {d.status}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl">{d.propertyTitle}</h3>
                <p className="text-xs opacity-75">
                  Buyer: <strong>{d.buyerName}</strong> ({d.buyerNationality}) • Advisor: {d.agentName}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="opacity-60 block">Sale Price</span>
                    <span className="font-bold text-white">
                      {formatCurrency(d.saleValueAED, currency, true)}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Gross Comm ({d.commissionPercent}%)</span>
                    <span className="font-bold text-amber-400">
                      {formatCurrency(d.grossCommissionAED, currency, true)}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-60 block">MGN Net Revenue</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(d.mgnNetRevenueAED, currency, true)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: MARKETING CAMPAIGNS ==================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold">MGN Marketing Campaigns & ROAS</h2>
            <button
              onClick={() => setShowCampModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Launch Campaign
            </button>
          </div>

          {showCampModal && (
            <form onSubmit={handleCreateCampaign} className={`p-6 rounded-3xl border ${cardClass} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <input
                required
                placeholder="Campaign Name"
                value={newCamp.campaignName}
                onChange={(e) => setNewCamp({ ...newCamp, campaignName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                placeholder="Channel (e.g., Google Ads, Property Finder)"
                value={newCamp.channel}
                onChange={(e) => setNewCamp({ ...newCamp, channel: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Budget (AED)"
                value={newCamp.budgetAED}
                onChange={(e) => setNewCamp({ ...newCamp, budgetAED: Number(e.target.value) })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <div className="flex gap-2 sm:col-span-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaigns.map((c) => {
              const roas = c.spendAED > 0 ? (c.revenueAttributedAED / c.spendAED).toFixed(1) : '0';
              return (
                <div key={c._id} className={`p-6 rounded-3xl border ${cardClass} space-y-3`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400">{c.channel}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                      {roas}x ROAS
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl">{c.campaignName}</h3>
                  <p className="text-xs opacity-75">
                    Target: {c.targetCommunity} • {c.targetAudience}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="opacity-60 block">Spend</span>
                      <span className="font-bold">{formatCurrency(c.spendAED, currency, true)}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">Leads / Deals</span>
                      <span className="font-bold text-amber-400">
                        {c.leadsGenerated} Leads / {c.dealsAttributed} Deals
                      </span>
                    </div>
                    <div>
                      <span className="opacity-60 block">Revenue Attributed</span>
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(c.revenueAttributedAED, currency, true)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: VIP VIEWINGS ==================== */}
      {activeTab === 'viewings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold">VIP Chauffeur Viewings & Tours</h2>
            <button
              onClick={() => setShowViewingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Schedule Viewing
            </button>
          </div>

          {showViewingModal && (
            <form onSubmit={handleCreateViewing} className={`p-6 rounded-3xl border ${cardClass} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <input
                required
                placeholder="Client Name"
                value={newViewing.clientName}
                onChange={(e) => setNewViewing({ ...newViewing, clientName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                required
                placeholder="Property Title"
                value={newViewing.propertyTitle}
                onChange={(e) => setNewViewing({ ...newViewing, propertyTitle: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <input
                type="date"
                value={newViewing.scheduledDate}
                onChange={(e) => setNewViewing({ ...newViewing, scheduledDate: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
              <div className="flex gap-2 sm:col-span-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Confirm VIP Tour
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {viewings.map((v) => (
              <div key={v._id} className={`p-5 rounded-3xl border ${cardClass} space-y-2`}>
                <span className="text-xs font-bold text-amber-400">
                  {v.scheduledDate} • {v.scheduledTime}
                </span>
                <h3 className="font-bold text-lg">{v.clientName}</h3>
                <p className="text-xs text-emerald-400 font-semibold">{v.propertyTitle}</p>
                <p className="text-xs opacity-70">
                  {v.viewingType} • Advisor: {v.agentName}
                </p>
                {v.notes && <p className="text-xs opacity-60 italic">&ldquo;{v.notes}&rdquo;</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
