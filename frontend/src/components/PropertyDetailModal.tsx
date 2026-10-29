'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Phone,
  Sparkles,
  Send,
} from 'lucide-react';
import { Property } from '@/types';
import { CurrencyCode, formatCurrency, apiRequest } from '@/lib/api';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: CurrencyCode;
  onClose: () => void;
  onLeadSubmitted: () => void;
}

export default function PropertyDetailModal({
  property,
  currency,
  onClose,
  onLeadSubmitted,
}: PropertyDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('United Kingdom');
  const [paymentPreference, setPaymentPreference] = useState('Developer Payment Plan');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!property) return null;

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          phone,
          nationality,
          budgetAED: property.priceAED,
          interestedCommunity: property.community,
          interestedPropertyId: property._id,
          interestedPropertyTitle: property.title,
          purpose: 'Investment / High ROI',
          paymentPreference,
          source: 'Website Direct',
          priority: property.priceAED >= 15000000 ? 'VIP / High' : 'Medium',
          assignedAgent: property.assignedAgentName,
          notes: `Direct dossier & private viewing inquiry for ${property.referenceCode} (${property.title}).`,
        }),
      });
      setSubmitted(true);
      onLeadSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl bg-slate-950 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[92vh] overflow-y-auto text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:text-slate-950 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={property.images[selectedImage] || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                    {property.listingType}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-amber-300 border border-amber-500/40">
                    {property.referenceCode}
                  </span>
                  {property.goldenVisaEligible && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-slate-950 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> 10-Yr Golden Visa
                    </span>
                  )}
                </div>
              </div>

              {property.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  {property.community} • {property.developer}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">{property.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{property.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-amber-400" /> Bedrooms
                  </span>
                  <p className="text-lg font-bold mt-1">{property.bedrooms} Suites</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-amber-400" /> Bathrooms
                  </span>
                  <p className="text-lg font-bold mt-1">{property.bathrooms} Baths</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Built-up Area
                  </span>
                  <p className="text-lg font-bold mt-1">{property.areaSqFt.toLocaleString('en-US')} Sq.Ft</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Est. Net ROI
                  </span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">{property.roiEstimate}% / yr</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>

              {/* Payment Plan */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Developer Payment Structure ({property.paymentPlan?.summary})
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Handover: {property.completionYear}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <p className="text-xl font-bold text-amber-400">{property.paymentPlan?.downPayment || 20}%</p>
                    <span className="text-[11px] text-slate-400">On Booking</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <p className="text-xl font-bold text-white">
                      {property.paymentPlan?.duringConstruction || 40}%
                    </p>
                    <span className="text-[11px] text-slate-400">During Construction</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <p className="text-xl font-bold text-emerald-400">{property.paymentPlan?.onHandover || 40}%</p>
                    <span className="text-[11px] text-slate-400">On Handover</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Signature Residence Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Instant VIP Lead Capture */}
            <div className="lg:col-span-5 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Asking Price</span>
                  <div className="text-3xl font-display font-bold gold-shimmer mt-1">
                    {formatCurrency(property.priceAED, currency)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                    <span>DLD Permit: {property.dldPermitNumber}</span>
                    <span>{formatCurrency(Math.round(property.priceAED / property.areaSqFt), currency)} / sq.ft</span>
                  </div>
                </div>

                {/* Assigned Broker */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/mgn-logo.png"
                      alt="MGN"
                      className="w-11 h-11 rounded-xl object-cover border border-amber-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                        Exclusive MGN Private Advisor
                      </span>
                      <p className="font-bold text-white text-sm mt-0.5">{property.assignedAgentName}</p>
                      <p className="text-xs text-slate-400">{property.assignedAgentPhone}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${property.assignedAgentPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500 hover:text-slate-950 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> Direct Call
                  </a>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3">
                    <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="font-display text-xl font-bold text-white">
                      VIP Dossier & Viewing Registered
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Your inquiry has been logged directly into the MGN Marketing CRM Pipeline and assigned to{' '}
                      <strong>{property.assignedAgentName}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-4">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      Request Floorplans, ROI Sheet & Private Tour
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Lord Alexander Kensington"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@domain.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Phone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 50 000 0000"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Country / Residence</label>
                        <input
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Preferred Settlement</label>
                        <select
                          value={paymentPreference}
                          onChange={(e) => setPaymentPreference(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="Developer Payment Plan">Developer Payment Plan</option>
                          <option value="Cash Buyer">Cash Buyer</option>
                          <option value="Crypto / USDT">Crypto / USDT</option>
                          <option value="Mortgage Finance">UAE Mortgage Finance</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Registering VIP Request...' : 'Schedule Private Viewing & Get Brochure'}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>RERA Regulated Brokerage • ORN #31940</span>
                <span>0% Buyer Commission on Off-Plan</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
