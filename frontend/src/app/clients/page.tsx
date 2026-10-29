'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ClientLeadsWorkspace from '@/components/ClientLeadsWorkspace';
import { Lead, Agent, Property } from '@/types';
import { CurrencyCode, apiRequest } from '@/lib/api';
import { ArrowLeft, Globe, Sun, Moon } from 'lucide-react';

export default function ClientsDedicatedPage() {
  const [currency, setCurrency] = useState<CurrencyCode>('AED');
  const [isDark, setIsDark] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [leadsData, agentsData, propsData] = await Promise.all([
        apiRequest<Lead[]>('/leads'),
        apiRequest<Agent[]>('/operations/agents'),
        apiRequest<Property[]>('/properties'),
      ]);
      setLeads(leadsData);
      setAgents(agentsData);
      setProperties(propsData);
    } catch (err) {
      console.error('Failed to load clients data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#070A12] text-slate-100' : 'bg-[#FAF7F0] text-slate-900'
      }`}
    >
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
          isDark
            ? 'bg-[#070A12]/85 border-amber-500/20 text-white'
            : 'bg-white/90 border-amber-300/60 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs font-bold text-amber-400 hover:underline"
          >
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing"
              className="w-9 h-9 rounded-xl object-cover border border-amber-500/40"
            />
            <ArrowLeft className="w-4 h-4" />
            Back to MGN Marketing Main Hub
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-amber-400">
              <Globe className="w-3.5 h-3.5" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent focus:outline-none"
              >
                <option value="AED">AED</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-amber-400"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <ClientLeadsWorkspace
        leads={leads}
        agents={agents}
        properties={properties}
        currency={currency}
        isDark={isDark}
        onRefreshAll={fetchData}
      />
    </div>
  );
}
