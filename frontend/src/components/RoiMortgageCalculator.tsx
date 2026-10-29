'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Award,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CurrencyCode, formatCurrency } from '@/lib/api';

interface RoiMortgageCalculatorProps {
  currency: CurrencyCode;
  isDark: boolean;
  onRequestAdvisory: (summary: string) => void;
}

export default function RoiMortgageCalculator({
  currency,
  isDark,
  onRequestAdvisory,
}: RoiMortgageCalculatorProps) {
  const [activeMode, setActiveMode] = useState<'roi' | 'mortgage'>('roi');
  const [propertyPrice, setPropertyPrice] = useState<number>(12500000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(4.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [expectedRentYield, setExpectedRentYield] = useState<number>(8.2);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(10.5);
  const [holdingYears, setHoldingYears] = useState<number>(5);

  // Mortgage calculations
  const downPaymentAED = (propertyPrice * downPaymentPct) / 100;
  const loanAmountAED = propertyPrice - downPaymentAED;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyMortgageAED =
    monthlyRate > 0
      ? (loanAmountAED * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmountAED / totalPayments;

  // ROI calculations
  const annualGrossRentAED = (propertyPrice * expectedRentYield) / 100;
  const serviceChargesAED = propertyPrice * 0.008; // ~0.8% DLD service fee estimate
  const annualNetRentAED = annualGrossRentAED - serviceChargesAED;
  const totalRentalIncomeAED = annualNetRentAED * holdingYears;
  const projectedValueAED = propertyPrice * Math.pow(1 + annualAppreciation / 100, holdingYears);
  const capitalGainAED = projectedValueAED - propertyPrice;
  const totalProfitAED = totalRentalIncomeAED + capitalGainAED;
  const totalRoiPercent = ((totalProfitAED / propertyPrice) * 100).toFixed(1);
  const goldenVisaEligible = propertyPrice >= 2000000;

  return (
    <section id="calculator" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Dubai Tax-Free Wealth Intelligence
            </div>
            <h2
              className={`font-display text-3xl sm:text-5xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Interactive <span className="gold-shimmer">ROI & Mortgage</span> Suite
            </h2>
          </div>

          <div
            className={`inline-flex p-1.5 rounded-2xl border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-amber-50/80 border-amber-200'
            }`}
          >
            <button
              onClick={() => setActiveMode('roi')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeMode === 'roi'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              5-Year Capital & Yield ROI
            </button>
            <button
              onClick={() => setActiveMode('mortgage')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeMode === 'mortgage'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              UAE Bank Mortgage Estimator
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sliders Control Panel */}
          <div
            className={`lg:col-span-7 rounded-3xl p-8 border backdrop-blur-xl ${
              isDark
                ? 'bg-slate-900/70 border-slate-800/90 text-white'
                : 'bg-white border-amber-200/80 text-slate-900 shadow-xl'
            }`}
          >
            <div className="space-y-7">
              {/* Property Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    Property Acquisition Value
                  </label>
                  <span className="text-xl font-bold text-amber-400">
                    {formatCurrency(propertyPrice, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1500000}
                  max={80000000}
                  step={500000}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs opacity-50 mt-1">
                  <span>{formatCurrency(1500000, currency, true)}</span>
                  <span>{formatCurrency(25000000, currency, true)}</span>
                  <span>{formatCurrency(80000000, currency, true)}</span>
                </div>
              </div>

              {activeMode === 'roi' ? (
                <>
                  {/* Expected Net Rental Yield */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-amber-400" />
                        Annual Rental Yield (0% Income Tax in UAE)
                      </label>
                      <span className="text-lg font-bold text-emerald-400">{expectedRentYield}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={14}
                      step={0.2}
                      value={expectedRentYield}
                      onChange={(e) => setExpectedRentYield(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Capital Appreciation */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        Projected Annual Capital Appreciation
                      </label>
                      <span className="text-lg font-bold text-amber-400">{annualAppreciation}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={20}
                      step={0.5}
                      value={annualAppreciation}
                      onChange={(e) => setAnnualAppreciation(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Holding Horizon */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        Investment Horizon
                      </label>
                      <span className="text-lg font-bold">{holdingYears} Years</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {[3, 5, 7, 10, 15].map((yr) => (
                        <button
                          key={yr}
                          onClick={() => setHoldingYears(yr)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            holdingYears === yr
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                              : isDark
                              ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-amber-500/40'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-amber-500'
                          }`}
                        >
                          {yr} Years
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Down Payment Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        Down Payment ({downPaymentPct}%)
                      </label>
                      <span className="text-lg font-bold text-amber-400">
                        {formatCurrency(downPaymentAED, currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={5}
                      value={downPaymentPct}
                      onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* UAE Interest Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-amber-400" />
                        UAE Fixed Bank Rate (EIBOR Linked)
                      </label>
                      <span className="text-lg font-bold text-emerald-400">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={3.25}
                      max={6.5}
                      step={0.05}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium opacity-80 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        Mortgage Tenure (Up to 25 Years)
                      </label>
                      <span className="text-lg font-bold">{loanTermYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={1}
                      value={loanTermYears}
                      onChange={(e) => setLoanTermYears(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Golden Visa Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  goldenVisaEligible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      {goldenVisaEligible
                        ? '10-Year UAE Golden Visa Qualified (AED 2M+ Threshold Met)'
                        : 'Add AED 500K to Qualify for 10-Year UAE Golden Visa'}
                    </p>
                    <p className="text-xs opacity-75">
                      Includes full family sponsorship, Emirates ID & 0% personal or capital gains tax.
                    </p>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-amber-500/40 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeMode === 'roi' ? (
                <motion.div
                  key="roi-panel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                      Projected {holdingYears}-Year Combined Wealth Return
                    </span>
                    <div className="text-4xl sm:text-5xl font-display font-bold mt-2 gold-shimmer">
                      {formatCurrency(totalProfitAED, currency)}
                    </div>
                    <p className="text-sm text-emerald-400 font-medium mt-1">
                      +{totalRoiPercent}% Total Cumulative Return (Tax-Free)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Net Annual Rental Income</span>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(annualNetRentAED, currency)}
                      </p>
                      <span className="text-[11px] text-emerald-400">Paid via direct escrow/cheques</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">{holdingYears}-Yr Rental Cashflow</span>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(totalRentalIncomeAED, currency)}
                      </p>
                      <span className="text-[11px] text-amber-400">0% UAE Rental Tax</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Capital Appreciation</span>
                      <p className="text-lg font-bold text-emerald-400 mt-1">
                        +{formatCurrency(capitalGainAED, currency)}
                      </p>
                      <span className="text-[11px] text-slate-400">At {annualAppreciation}% CAGR</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Est. Asset Value Yr {holdingYears}</span>
                      <p className="text-lg font-bold text-amber-300 mt-1">
                        {formatCurrency(projectedValueAED, currency, true)}
                      </p>
                      <span className="text-[11px] text-slate-400">DLD Title Deed Valuation</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="mortgage-panel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                      Estimated Monthly Mortgage Installment
                    </span>
                    <div className="text-4xl sm:text-5xl font-display font-bold mt-2 gold-shimmer">
                      {formatCurrency(monthlyMortgageAED, currency)}
                      <span className="text-base font-sans text-slate-400 font-normal"> / month</span>
                    </div>
                    <p className="text-sm text-emerald-400 font-medium mt-1">
                      Non-Resident & Resident Pre-Approval in 48 Hours
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Bank Financed Amount</span>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(loanAmountAED, currency)}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Initial Down Payment</span>
                      <p className="text-lg font-bold text-amber-400 mt-1">
                        {formatCurrency(downPaymentAED, currency)}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">Monthly Rent Coverage</span>
                      <p className="text-lg font-bold text-emerald-400 mt-1">
                        {formatCurrency(annualGrossRentAED / 12, currency)} / mo
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400">DLD Registration (4%)</span>
                      <p className="text-lg font-bold text-white mt-1">
                        {formatCurrency(propertyPrice * 0.04, currency)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>MGN Marketing structures Crypto/USDT, Bank Wire & Escrow settlements</span>
              </div>
              <button
                onClick={() =>
                  onRequestAdvisory(
                    `ROI & Mortgage Report Request: Budget ${formatCurrency(
                      propertyPrice,
                      currency
                    )}, Projected ${holdingYears}-Yr Profit ${formatCurrency(totalProfitAED, currency)}`
                  )
                }
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-amber-500/25"
              >
                Download Custom PDF & Book Wealth Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
