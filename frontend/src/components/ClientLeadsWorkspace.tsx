'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Building2,
  Key,
  Home,
  BadgeDollarSign,
  Search,
  Phone,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit3,
  MessageSquare,
  X,
} from 'lucide-react';
import { Lead, Agent, Property, ClientIntentType } from '@/types';
import { CurrencyCode, formatCurrency, apiRequest } from '@/lib/api';

interface ClientLeadsWorkspaceProps {
  leads: Lead[];
  agents: Agent[];
  properties: Property[];
  currency: CurrencyCode;
  isDark: boolean;
  onRefreshAll: () => Promise<void>;
}

const INTENT_OPTIONS: {
  id: ClientIntentType;
  label: string;
  shortLabel: string;
  priceLabel: string;
  badgeStyle: string;
  activeTabStyle: string;
  accentBar: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'Buy Property',
    label: 'Want to Buy',
    shortLabel: 'Buy',
    priceLabel: 'Budget (AED)',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    activeTabStyle: 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20',
    accentBar: 'from-amber-400 to-yellow-600',
    icon: Building2,
  },
  {
    id: 'Sell Property (Owner)',
    label: 'Want to Sell',
    shortLabel: 'Sell',
    priceLabel: 'Asking Price (AED)',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    activeTabStyle: 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20',
    accentBar: 'from-emerald-400 to-teal-500',
    icon: BadgeDollarSign,
  },
  {
    id: 'Rent a Property (Tenant)',
    label: 'Want on Rent',
    shortLabel: 'Rent',
    priceLabel: 'Yearly Rent (AED)',
    badgeStyle: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    activeTabStyle: 'bg-sky-400 text-slate-950 border-sky-300 shadow-lg shadow-sky-500/20',
    accentBar: 'from-sky-400 to-blue-500',
    icon: Key,
  },
  {
    id: 'Rent Out Property (Landlord)',
    label: 'Want to Rent Out',
    shortLabel: 'Rent Out',
    priceLabel: 'Yearly Rent (AED)',
    badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    activeTabStyle: 'bg-purple-400 text-slate-950 border-purple-300 shadow-lg shadow-purple-500/20',
    accentBar: 'from-purple-400 to-fuchsia-500',
    icon: Home,
  },
];

const DUBAI_AREAS = [
  'Downtown Dubai',
  'Palm Jumeirah',
  'Dubai Marina',
  'Business Bay',
  'Dubai Hills Estate',
  'Dubai Creek Harbour',
  'Jumeirah Village Circle (JVC)',
  'Emaar Beachfront',
];

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Duplex', 'Commercial'];

export default function ClientLeadsWorkspace({
  leads,
  currency,
  isDark,
  onRefreshAll,
}: ClientLeadsWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Minimal Form Fields
  const [clientIntent, setClientIntent] = useState<ClientIntentType>('Buy Property');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyCategory, setPropertyCategory] = useState('Apartment');
  const [interestedCommunity, setInterestedCommunity] = useState('Dubai Marina');
  const [budgetAED, setBudgetAED] = useState<string>('2500000');

  const currentIntentMeta = useMemo(
    () => INTENT_OPTIONS.find((i) => i.id === clientIntent) || INTENT_OPTIONS[0],
    [clientIntent]
  );

  const openNewClientModal = () => {
    setEditingLeadId(null);
    setClientIntent('Buy Property');
    setFullName('');
    setPhone('');
    setPropertyCategory('Apartment');
    setInterestedCommunity('Dubai Marina');
    setBudgetAED('2500000');
    setIsModalOpen(true);
  };

  const openEditClientModal = (lead: Lead) => {
    setEditingLeadId(lead._id);
    setClientIntent((lead.clientIntent as ClientIntentType) || 'Buy Property');
    setFullName(lead.fullName);
    setPhone(lead.phone);
    setPropertyCategory(lead.propertyCategory || 'Apartment');
    setInterestedCommunity(lead.interestedCommunity || 'Dubai Marina');
    setBudgetAED(String(lead.budgetAED || 2500000));
    setIsModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName,
        phone,
        email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@client.mgn.ae`,
        clientIntent,
        propertyCategory,
        interestedCommunity,
        interestedPropertyTitle: `${propertyCategory} in ${interestedCommunity}`,
        budgetAED: Number(budgetAED) || 0,
      };

      if (editingLeadId) {
        await apiRequest(`/leads/${editingLeadId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToastMessage(`Updated ${fullName}`);
      } else {
        await apiRequest('/leads', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToastMessage(`Added ${fullName}`);
      }

      setIsModalOpen(false);
      await onRefreshAll();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    await apiRequest(`/leads/${id}`, { method: 'DELETE' });
    await onRefreshAll();
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      All: leads.length,
      'Buy Property': 0,
      'Sell Property (Owner)': 0,
      'Rent a Property (Tenant)': 0,
      'Rent Out Property (Landlord)': 0,
    };
    leads.forEach((l) => {
      const k = l.clientIntent || 'Buy Property';
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const intent = l.clientIntent || 'Buy Property';
      if (activeFilter !== 'All' && intent !== activeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.fullName.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.interestedCommunity.toLowerCase().includes(q) ||
          (l.propertyCategory || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, activeFilter, searchQuery]);

  const cardBg = isDark
    ? 'bg-[#0C1220]/90 border-slate-800/80 hover:border-amber-500/40 text-white'
    : 'bg-white border-slate-200 hover:border-amber-400 text-slate-900 shadow-sm';

  const inputBg = isDark
    ? 'bg-[#070A12] border-slate-800 text-white focus:border-amber-400'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ==================== COMPACT HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/mgn-logo.png"
            alt="MGN Marketing"
            className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40 shadow-md shrink-0"
          />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Clients & Leads
            </h1>
            <p className="text-xs opacity-65">
              Buyers • Sellers • Renters • Landlords
            </p>
          </div>
        </div>

        <button
          onClick={openNewClientModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          + Add Client
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== UNIFIED SEARCH + FILTER BAR ==================== */}
      <div
        className={`p-3.5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
          isDark ? 'bg-[#0C1220]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'All'
                ? 'bg-amber-500 text-slate-950 shadow'
                : isDark
                ? 'text-slate-300 hover:bg-slate-800/70'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All ({counts.All})
          </button>

          {INTENT_OPTIONS.map((item) => {
            const Icon = item.icon;
            const active = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(active ? 'All' : item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-800/70'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label} ({counts[item.id] || 0})
              </button>
            );
          })}
        </div>

        {/* Clean Search Input */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border lg:w-80 ${
            isDark
              ? 'bg-[#070A12] border-slate-800 focus-within:border-amber-400'
              : 'bg-slate-50 border-slate-300 focus-within:border-amber-500'
          }`}
        >
          <Search className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, area..."
            className="bg-transparent text-xs focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="opacity-60 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ==================== SLEEK, SHORT 3-COLUMN CLIENT CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => {
          const intentType = (lead.clientIntent as ClientIntentType) || 'Buy Property';
          const intentMeta =
            INTENT_OPTIONS.find((i) => i.id === intentType) || INTENT_OPTIONS[0];
          const isRental =
            intentType === 'Rent a Property (Tenant)' ||
            intentType === 'Rent Out Property (Landlord)';

          return (
            <motion.div
              key={lead._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative rounded-2xl border p-5 transition-all duration-200 overflow-hidden ${cardBg}`}
            >
              {/* Subtle top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${intentMeta.accentBar}`}
              />

              {/* Row 1: Badge + Price */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${intentMeta.badgeStyle}`}
                >
                  {intentMeta.label}
                </span>

                <span className="text-base font-display font-bold text-amber-400">
                  {formatCurrency(lead.budgetAED, currency, true)}
                  {isRental && <span className="text-[11px] font-sans font-normal opacity-70">/yr</span>}
                </span>
              </div>

              {/* Row 2: Client Name & Phone */}
              <div className="mb-3">
                <h3 className="text-lg font-bold truncate">{lead.fullName}</h3>
                <p className="text-xs opacity-60 mt-0.5">{lead.phone}</p>
              </div>

              {/* Row 3: Single Compact Tag Line for Property & Area */}
              <div
                className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between mb-4 ${
                  isDark ? 'bg-[#070A12]/90 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-semibold flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {lead.propertyCategory || 'Apartment'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-medium flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {lead.interestedCommunity}
                </span>
              </div>

              {/* Row 4: Quick Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${lead.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition-all"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditClientModal(lead)}
                    title="Edit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead._id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== COMPACT, ATTRACTIVE ADD/EDIT MODAL ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl relative overflow-hidden ${
                isDark ? 'bg-[#0B101E] border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Top Gold Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/mgn-logo.png"
                    alt="MGN"
                    className="w-9 h-9 rounded-xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      {editingLeadId ? 'Edit Client' : 'New Client'}
                    </h2>
                    <p className="text-[11px] opacity-60">Quick client registration</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4">
                {/* 4 Compact Intent Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#070A12] border border-slate-800">
                  {INTENT_OPTIONS.map((item) => {
                    const active = clientIntent === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setClientIntent(item.id);
                          if (!editingLeadId) {
                            setBudgetAED(item.id.includes('Rent') ? '180000' : '2500000');
                          }
                        }}
                        className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                          active
                            ? item.activeTabStyle
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Client Name */}
                <div>
                  <label className="text-xs opacity-70 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Ahmad Al-Farsi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${inputBg}`}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs opacity-70 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${inputBg}`}
                  />
                </div>

                {/* Property Type + Area in 1 Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs opacity-70 block mb-1">Property</label>
                    <select
                      value={propertyCategory}
                      onChange={(e) => setPropertyCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputBg}`}
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs opacity-70 block mb-1">Dubai Area</label>
                    <select
                      value={interestedCommunity}
                      onChange={(e) => setInterestedCommunity(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputBg}`}
                    >
                      {DUBAI_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget / Price */}
                <div>
                  <label className="text-xs opacity-70 block mb-1">
                    {currentIntentMeta.priceLabel} *
                  </label>
                  <input
                    type="number"
                    required
                    value={budgetAED}
                    onChange={(e) => setBudgetAED(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold text-amber-400 focus:outline-none ${inputBg}`}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all mt-2"
                >
                  {submitting ? 'Saving...' : editingLeadId ? 'Update Client' : 'Save Client'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
