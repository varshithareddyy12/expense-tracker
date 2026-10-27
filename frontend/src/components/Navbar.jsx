import React from 'react';
import { Wallet, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ onOpenAddModal, isBackendOnline, checkingHealth, onRefresh, currency, setCurrency }) {
  const currencies = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">SpendWise</h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Expense Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Track, understand, and master your spending</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              {currencies.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => setCurrency(c.symbol)}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    currency === c.symbol
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={c.label}
                >
                  {c.symbol}
                </button>
              ))}
            </div>

            {/* Backend Connectivity Status Indicator */}
            <button
              onClick={onRefresh}
              title="Click to check backend health status"
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${
                checkingHealth
                  ? 'bg-slate-50 text-slate-600 border-slate-200'
                  : isBackendOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                checkingHealth ? 'bg-amber-400 animate-pulse' : isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
              <span className="font-medium">
                {checkingHealth ? 'Checking...' : isBackendOnline ? 'API Connected' : 'API Offline'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 ${checkingHealth ? 'animate-spin' : ''}`} />
            </button>

            {/* Quick Add Expense Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
