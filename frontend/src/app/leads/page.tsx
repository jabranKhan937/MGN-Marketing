'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExcelLeadsDirectory from '@/components/ExcelLeadsDirectory';
import { ArrowLeft, Sun, Moon, FileSpreadsheet } from 'lucide-react';

export default function LeadsDedicatedPage() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#070A12] text-slate-100' : 'bg-[#FAF7F0] text-slate-900'
      }`}
    >
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
          isDark
            ? 'bg-[#070A12]/90 border-[#C5A059]/25 text-white'
            : 'bg-white/95 border-amber-300/60 text-slate-900'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs font-bold text-[#C5A059] hover:underline"
          >
            <img
              src="/mgn-logo.png"
              alt="MGN Marketing"
              className="w-9 h-9 rounded-xl object-cover border border-[#C5A059]/40"
            />
            <ArrowLeft className="w-4 h-4" />
            Back to MGN Marketing Main Hub
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              leads (3).xlsx • 13,760 Verified Leads
            </span>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-[#C5A059]"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <ExcelLeadsDirectory isDark={isDark} />
    </div>
  );
}
