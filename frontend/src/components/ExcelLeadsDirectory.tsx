'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Building2,
  Download,
  FileSpreadsheet,
  Users,
  Globe,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  X,
  Filter,
  Sparkles,
} from 'lucide-react';

export interface ExcelLeadRecord {
  id: number;
  name: string;
  mobile: string;
  project: string;
  email: string;
  leadType: string;
  date: string;
  sheet: 'Sheet 1' | 'Sheet 2' | string;
}

interface ExcelLeadsDirectoryProps {
  isDark: boolean;
}

const DEVELOPER_FILTERS = [
  'All Projects',
  'Emaar',
  'Damac',
  'Nakheel',
  'Meraas',
  'OMNIYAT',
  'Sobha',
  'Aldar',
  'Downtown Dubai',
  'Palm Jebel Ali',
  'Dubai Marina',
  'Dubai Creek',
  'Al Raha Beach',
  'Al Reem Island',
];

const STORAGE_KEY = 'mgn_custom_excel_leads_v1';
const STATUS_STORAGE_KEY = 'mgn_excel_leads_statuses_v1';

export type CallDispositionStatus =
  | 'Pending'
  | 'Client Interested'
  | 'Not Interested'
  | 'Hang Up Call'
  | 'DNC Number'
  | 'No Response';

export const CALL_DISPOSITION_OPTIONS: {
  value: CallDispositionStatus;
  label: string;
  badgeClass: string;
}[] = [
  {
    value: 'Pending',
    label: 'Select Status',
    badgeClass: 'bg-slate-800/80 text-slate-300 border-slate-700',
  },
  {
    value: 'Client Interested',
    label: 'Client Interested',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  },
  {
    value: 'Not Interested',
    label: 'Not Interested',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  {
    value: 'Hang Up Call',
    label: 'Hang Up Call',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  {
    value: 'DNC Number',
    label: 'DNC Number',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/50',
  },
  {
    value: 'No Response',
    label: 'No Response',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  },
];

export function formatUaeOrIntlMobile(raw: string): string {
  const s = (raw || '').trim();
  const match = s.match(/^\+?971[\s-]*(.+)$/);
  if (match) {
    const rest = match[1].replace(/[\s-]+/g, '');
    return rest.startsWith('0') ? rest : `0${rest}`;
  }
  if (s.startsWith('0')) {
    return s.replace(/[\s-]+/g, '');
  }
  return s.startsWith('+') ? s : `+${s}`;
}

export function isUaeMobile(raw: string): boolean {
  const s = (raw || '').trim();
  return s.startsWith('0') || s.startsWith('971') || s.startsWith('+971');
}

export default function ExcelLeadsDirectory({ isDark }: ExcelLeadsDirectoryProps) {
  const [leads, setLeads] = useState<ExcelLeadRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sheetFilter, setSheetFilter] = useState<'ALL' | 'Sheet 1' | 'Sheet 2'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'UAE' | 'INTL'>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('All Projects');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [leadStatuses, setLeadStatuses] = useState<Record<number, CallDispositionStatus>>({});
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Copy / Toast feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newLead, setNewLead] = useState({
    name: '',
    mobile: '05',
    project: '',
    email: '',
    leadType: 'Buyer',
    date: new Date().toISOString().slice(0, 10),
    sheet: 'Sheet 1',
  });

  useEffect(() => {
    let mounted = true;
    async function loadExcelLeads() {
      try {
        setLoading(true);
        const res = await fetch('/data/excel-leads.json');
        const data: ExcelLeadRecord[] = await res.json();
        let customLeads: ExcelLeadRecord[] = [];
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) customLeads = JSON.parse(saved);
            const savedStatuses = localStorage.getItem(STATUS_STORAGE_KEY);
            if (savedStatuses) setLeadStatuses(JSON.parse(savedStatuses));
          } catch {
            // ignore storage errors
          }
        }
        if (mounted) {
          setLeads([...customLeads, ...data]);
        }
      } catch (err) {
        console.error('Failed to load excel leads data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadExcelLeads();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sheetFilter, typeFilter, regionFilter, projectFilter, statusFilter, pageSize]);

  const handleStatusChange = (leadId: number, status: CallDispositionStatus) => {
    setLeadStatuses((prev) => {
      const updated = { ...prev, [leadId]: status };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
      }
      return updated;
    });
  };

  const stats = useMemo(() => {
    let sheet1 = 0;
    let sheet2 = 0;
    let uaeCount = 0;
    let withEmailCount = 0;
    const projectSet = new Set<string>();

    for (let i = 0; i < leads.length; i++) {
      const l = leads[i];
      if (l.sheet === 'Sheet 1') sheet1++;
      else sheet2++;
      if (isUaeMobile(l.mobile)) uaeCount++;
      if (l.email && l.email.includes('@')) withEmailCount++;
      if (l.project && l.project !== '-') projectSet.add(l.project);
    }

    return {
      total: leads.length,
      sheet1,
      sheet2,
      uaeCount,
      intlCount: leads.length - uaeCount,
      withEmailCount,
      uniqueProjects: projectSet.size,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const projQ = projectFilter === 'All Projects' ? '' : projectFilter.toLowerCase();

    return leads.filter((item) => {
      if (sheetFilter !== 'ALL' && item.sheet !== sheetFilter) return false;

      if (typeFilter !== 'ALL') {
        if (item.leadType.toLowerCase() !== typeFilter.toLowerCase()) return false;
      }

      if (regionFilter !== 'ALL') {
        const isUae = isUaeMobile(item.mobile);
        if (regionFilter === 'UAE' && !isUae) return false;
        if (regionFilter === 'INTL' && isUae) return false;
      }

      if (projQ && !item.project.toLowerCase().includes(projQ)) {
        return false;
      }

      if (statusFilter !== 'ALL') {
        const currentStatus = leadStatuses[item.id] || 'Pending';
        if (currentStatus !== statusFilter) return false;
      }

      if (q) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchMobile = item.mobile.toLowerCase().includes(q);
        const matchProject = item.project.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchType = item.leadType.toLowerCase().includes(q);
        const currentStatus = (leadStatuses[item.id] || 'Pending').toLowerCase();
        const matchStatus = currentStatus.includes(q);
        if (!matchName && !matchMobile && !matchProject && !matchEmail && !matchType && !matchStatus) {
          return false;
        }
      }

      return true;
    });
  }, [leads, searchQuery, sheetFilter, typeFilter, regionFilter, projectFilter, statusFilter, leadStatuses]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ExcelLeadRecord = {
      id: leads.length + 1,
      name: newLead.name.trim(),
      mobile: formatUaeOrIntlMobile(newLead.mobile.trim()),
      project: newLead.project.trim() || 'General Inquiry',
      email: newLead.email.trim(),
      leadType: newLead.leadType,
      date: newLead.date,
      sheet: newLead.sheet,
    };

    const updated = [created, ...leads];
    setLeads(updated);

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([created, ...existing]));
      } catch {
        // ignore storage error
      }
    }

    setIsAddModalOpen(false);
    setNewLead({
      name: '',
      mobile: '05',
      project: '',
      email: '',
      leadType: 'Buyer',
      date: new Date().toISOString().slice(0, 10),
      sheet: 'Sheet 1',
    });
    setCopiedText(`Added new lead: ${created.name}`);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Mobile No.', 'Project Interested In', 'Email', 'Type', 'Call Status', 'Sheet'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${formatUaeOrIntlMobile(l.mobile).replace(/"/g, '""')}"`,
      `"${(l.project || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.leadType || '').replace(/"/g, '""')}"`,
      `"${(leadStatuses[l.id] || 'Pending').replace(/"/g, '""')}"`,
      l.sheet,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mgn-leads-export-${filteredLeads.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cleanPhoneForWhatsApp = (raw: string) => {
    const digits = (raw || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) {
      return `971${digits.slice(1)}`;
    }
    return digits;
  };

  const surfaceClass = isDark
    ? 'bg-[#0C1220]/90 border-slate-800/90 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const inputClass = isDark
    ? 'bg-[#070A12] border-slate-800 text-white focus:border-[#C5A059]'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#C5A059]';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ==================== TOP HEADER & EXPORT BAR ==================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl overflow-hidden border border-[#C5A059]/50 bg-[#050A1F] p-0.5 shadow-lg shrink-0">
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing"
              className="w-12 h-12 rounded-xl object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[11px] font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3" />
              MGN Marketing • Master Leads Database (leads.xlsx)
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
              Dubai &amp; UAE <span className="gold-shimmer">Verified Leads Directory</span>
            </h1>
            <p className="text-xs opacity-70 mt-0.5">
              Complete imported dataset from <strong>leads (3).xlsx</strong> — Sheet 1 (Project &amp; Email Inquiries) &amp; Sheet 2 (Buyers, Sellers &amp; Landlords)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C5A059]/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>

          <button
            onClick={handleExportCsv}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-[#C5A059] hover:text-[#C5A059]'
                : 'bg-white border-slate-300 text-slate-800 hover:border-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            Export CSV ({filteredLeads.length.toLocaleString()})
          </button>

          <a
            href="/data/leads.xlsx"
            download="leads (3).xlsx"
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Download Original Excel
          </a>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {copiedText}
            </span>
            <button onClick={() => setCopiedText(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== KPI ANALYTICS STRIP ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C5A059]" /> Total Excel Leads
          </span>
          <p className="text-2xl font-display font-bold text-[#C5A059] mt-1">
            {stats.total.toLocaleString()}
          </p>
          <span className="text-[11px] opacity-60">100% Real Imported Data</span>
        </div>

        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> Sheet 1 Leads
          </span>
          <p className="text-2xl font-display font-bold mt-1">
            {stats.sheet1.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400">Project &amp; Email Inquiries</span>
        </div>

        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400" /> Sheet 2 Leads
          </span>
          <p className="text-2xl font-display font-bold text-sky-400 mt-1">
            {stats.sheet2.toLocaleString()}
          </p>
          <span className="text-[11px] opacity-65">Buyer • Seller • Landlord</span>
        </div>

        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> UAE (05...) Mobile
          </span>
          <p className="text-2xl font-display font-bold text-emerald-400 mt-1">
            {stats.uaeCount.toLocaleString()}
          </p>
          <span className="text-[11px] opacity-65">Direct Local Numbers</span>
        </div>

        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" /> International Leads
          </span>
          <p className="text-2xl font-display font-bold text-purple-400 mt-1">
            {stats.intlCount.toLocaleString()}
          </p>
          <span className="text-[11px] opacity-65">Global Overseas Investors</span>
        </div>

        <div className={`p-4 rounded-2xl border ${surfaceClass}`}>
          <span className="text-[10px] uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#C5A059]" /> Unique Projects
          </span>
          <p className="text-2xl font-display font-bold mt-1">
            {stats.uniqueProjects.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#C5A059]">
            {stats.withEmailCount.toLocaleString()} Verified Emails
          </span>
        </div>
      </div>

      {/* ==================== SEARCH & MULTI-FILTER CONTROL BAR ==================== */}
      <div className={`p-4 rounded-2xl border space-y-4 ${surfaceClass}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Sheet & Role Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: `All Leads (${stats.total.toLocaleString()})` },
              { id: 'Sheet 1', label: `Sheet 1: Project Inquiries (${stats.sheet1.toLocaleString()})` },
              { id: 'Sheet 2', label: `Sheet 2: Buyer / Seller / Landlord (${stats.sheet2.toLocaleString()})` },
            ].map((tab) => {
              const active = sheetFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSheetFilter(tab.id as 'ALL' | 'Sheet 1' | 'Sheet 2');
                    if (tab.id === 'Sheet 1') setTypeFilter('ALL');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#C5A059] text-neutral-950 shadow-md'
                      : isDark
                      ? 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {/* Role Filter Pills (Buyer / Seller / Landlord) */}
            {['Buyer', 'Seller', 'Landlord'].map((role) => {
              const active = typeFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    if (active) {
                      setTypeFilter('ALL');
                    } else {
                      setTypeFilter(role);
                      setSheetFilter('ALL');
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                      : isDark
                      ? 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {role}s
                </button>
              );
            })}
          </div>

          {/* Search Input & View Switcher */}
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border w-full sm:w-80 ${inputClass}`}>
              <Search className="w-4 h-4 text-[#C5A059] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, mobile, project, email..."
                className="bg-transparent text-xs focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="opacity-60 hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className={`p-1 rounded-xl border flex items-center shrink-0 ${isDark ? 'bg-[#070A12] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-2 rounded-lg text-xs transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#C5A059] text-neutral-950 font-bold'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
                className={`p-2 rounded-lg text-xs transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#C5A059] text-neutral-950 font-bold'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Filter Row: Developer / Project Quick Filter, Region, Date Month, Page Size */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#C5A059]" /> Filters:
            </span>

            {/* Developer / Project Dropdown */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputClass}`}
            >
              {DEVELOPER_FILTERS.map((dev) => (
                <option key={dev} value={dev}>
                  {dev === 'All Projects' ? 'All Projects & Developers' : `Project: ${dev}`}
                </option>
              ))}
            </select>

            {/* Phone Region Filter */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as 'ALL' | 'UAE' | 'INTL')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputClass}`}
            >
              <option value="ALL">All Phone Regions</option>
              <option value="UAE">UAE Numbers (05...)</option>
              <option value="INTL">International Numbers</option>
            </select>

            {/* Call Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputClass}`}
            >
              <option value="ALL">All Call Statuses</option>
              <option value="Client Interested">Client Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Hang Up Call">Hang Up Call</option>
              <option value="DNC Number">DNC Number</option>
              <option value="No Response">No Response</option>
              <option value="Pending">Not Contacted Yet</option>
            </select>

            {(searchQuery ||
              sheetFilter !== 'ALL' ||
              typeFilter !== 'ALL' ||
              regionFilter !== 'ALL' ||
              projectFilter !== 'All Projects' ||
              statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSheetFilter('ALL');
                  setTypeFilter('ALL');
                  setRegionFilter('ALL');
                  setProjectFilter('All Projects');
                  setStatusFilter('ALL');
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="opacity-70">
              Showing{' '}
              <strong className="text-[#C5A059]">
                {filteredLeads.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                –{Math.min(currentPage * pageSize, filteredLeads.length)}
              </strong>{' '}
              of <strong>{filteredLeads.length.toLocaleString()}</strong> leads
            </span>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputClass}`}
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
              <option value={250}>250 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================== MAIN LEADS TABLE OR CARD GRID ==================== */}
      {loading ? (
        <div className={`p-16 rounded-3xl border text-center space-y-3 ${surfaceClass}`}>
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
          <p className="font-display text-lg">Loading 13,760 Verified Leads from leads (3).xlsx...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className={`p-16 rounded-3xl border text-center space-y-3 ${surfaceClass}`}>
          <p className="font-display text-xl">No leads match your current filter criteria</p>
          <p className="text-xs opacity-60">Try clearing the search query or switching sheet filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className={`rounded-3xl border overflow-hidden ${surfaceClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] uppercase tracking-wider font-bold ${
                    isDark
                      ? 'bg-[#070A12] border-slate-800 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Mobile No.</th>
                  <th className="py-3.5 px-4">Project Interested In</th>
                  <th className="py-3.5 px-4">Email / Client Role</th>
                  <th className="py-3.5 px-4">Lead Status</th>
                  <th className="py-3.5 px-4 text-right">Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {paginatedLeads.map((item) => {
                  const waNumber = cleanPhoneForWhatsApp(item.mobile);
                  const displayMobile = formatUaeOrIntlMobile(item.mobile);
                  const isSheet2 = item.sheet === 'Sheet 2';
                  const currentStatus = leadStatuses[item.id] || 'Pending';
                  const statusMeta =
                    CALL_DISPOSITION_OPTIONS.find((o) => o.value === currentStatus) ||
                    CALL_DISPOSITION_OPTIONS[0];

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-amber-50/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] opacity-50">
                        #{item.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm">{item.name || '—'}</div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSheet2
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30'
                          }`}
                        >
                          {item.sheet}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-amber-400">
                          <span>{displayMobile}</span>
                          <button
                            onClick={() => handleCopy(displayMobile, 'Mobile')}
                            title="Copy Mobile Number"
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold line-clamp-2 flex items-start gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                          <span>{item.project || '—'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.email ? (
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[210px] opacity-85">{item.email}</span>
                            <button
                              onClick={() => handleCopy(item.email, 'Email')}
                              title="Copy Email"
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              item.leadType === 'Seller'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : item.leadType === 'Landlord'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {item.leadType || 'Buyer'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as CallDispositionStatus)
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none transition-all ${statusMeta.badgeClass}`}
                        >
                          {CALL_DISPOSITION_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-slate-900 text-white"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`tel:${displayMobile}`}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition-all"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Hello ${item.name}, reaching out from MGN Marketing Dubai regarding your inquiry for ${item.project}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                          {item.email && (
                            <a
                              href={`mailto:${item.email}?subject=${encodeURIComponent(
                                `MGN Marketing Dubai — ${item.project}`
                              )}`}
                              className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition-all"
                              title={`Email ${item.email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ==================== CARD GRID VIEW ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedLeads.map((item) => {
            const waNumber = cleanPhoneForWhatsApp(item.mobile);
            const displayMobile = formatUaeOrIntlMobile(item.mobile);
            const currentStatus = leadStatuses[item.id] || 'Pending';
            const statusMeta =
              CALL_DISPOSITION_OPTIONS.find((o) => o.value === currentStatus) ||
              CALL_DISPOSITION_OPTIONS[0];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 relative overflow-hidden ${surfaceClass}`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#B89B5E]" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono opacity-60">Lead #{item.id}</span>
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as CallDispositionStatus)
                      }
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer focus:outline-none transition-all ${statusMeta.badgeClass}`}
                    >
                      {CALL_DISPOSITION_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-slate-900 text-white"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h3 className="font-display text-lg font-bold truncate">{item.name}</h3>
                  <p className="text-xs font-mono text-amber-400 mt-0.5">{displayMobile}</p>

                  <div
                    className={`mt-3 p-3 rounded-xl text-xs space-y-1.5 ${
                      isDark ? 'bg-[#070A12]/90' : 'bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold flex items-start gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.project || 'General Property Inquiry'}</span>
                    </div>
                    {item.email ? (
                      <div className="text-[11px] opacity-75 flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-sky-400 font-semibold">
                        Role: {item.leadType} ({item.sheet})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${displayMobile}`}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition-all"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(displayMobile, 'Phone')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="Copy Phone"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ==================== PAGINATION BAR ==================== */}
      {!loading && filteredLeads.length > 0 && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${surfaceClass}`}
        >
          <div className="text-xs opacity-75">
            Page <strong className="text-[#C5A059]">{currentPage}</strong> of{' '}
            <strong>{totalPages.toLocaleString()}</strong> ({filteredLeads.length.toLocaleString()}{' '}
            total matching records)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:border-[#C5A059] transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:border-[#C5A059] text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            {/* Page Number Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pageNum = currentPage - 2 + idx;
                if (currentPage <= 3) pageNum = idx + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#C5A059] text-neutral-950 shadow'
                        : 'border border-slate-800 hover:border-[#C5A059]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:border-[#C5A059] text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-800 disabled:opacity-30 hover:border-[#C5A059] transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== ADD NEW LEAD MODAL ==================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl relative overflow-hidden ${surfaceClass}`}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#B89B5E]" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-bold">Add Lead to Directory</h2>
                  <p className="text-xs opacity-65">Append a new record to the MGN Leads Database</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                  <label className="text-xs opacity-75 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="e.g., Satyanarayana Tangirala"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="text-xs opacity-75 block mb-1">Mobile No. *</label>
                  <input
                    type="text"
                    required
                    value={newLead.mobile}
                    onChange={(e) => setNewLead({ ...newLead, mobile: e.target.value })}
                    placeholder="0556146399"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="text-xs opacity-75 block mb-1">Project Interested In *</label>
                  <input
                    type="text"
                    required
                    value={newLead.project}
                    onChange={(e) => setNewLead({ ...newLead, project: e.target.value })}
                    placeholder="e.g., The Grand By Emaar"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs opacity-75 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="client@email.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
                    />
                  </div>

                  <div>
                    <label className="text-xs opacity-75 block mb-1">Client Type</label>
                    <select
                      value={newLead.leadType}
                      onChange={(e) => setNewLead({ ...newLead, leadType: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${inputClass}`}
                    >
                      <option value="Inquiry">Project Inquiry</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                      <option value="Landlord">Landlord</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  Save Lead
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
