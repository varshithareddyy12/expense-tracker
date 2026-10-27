import React from 'react';
import { DollarSign, Receipt, TrendingUp, Layers } from 'lucide-react';
import { formatCurrency, getCategoryConfig } from '../utils/categories';

export default function StatCards({ summary, currency }) {
  const totalAmount = summary?.totalAmount || 0;
  const totalCount = summary?.totalCount || 0;
  const averageAmount = summary?.averageAmount || 0;
  
  // Find top category
  const topCategorySummary = summary?.categoryBreakdowns?.[0];
  const topCategoryConfig = topCategorySummary ? getCategoryConfig(topCategorySummary.category) : null;
  const TopCategoryIcon = topCategoryConfig ? topCategoryConfig.icon : Layers;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      
      {/* 1. Total Spending Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Total Spent</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(totalAmount, currency)}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
          <span className="text-indigo-600 font-semibold">{totalCount}</span>
          <span>total recorded expenses</span>
        </div>
      </div>

      {/* 2. Total Transactions Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Transactions</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {totalCount}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Saved entries in database
        </div>
      </div>

      {/* 3. Top Spending Category */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Top Category</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TopCategoryIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
          {topCategorySummary ? topCategorySummary.category : '—'}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>{topCategorySummary ? formatCurrency(topCategorySummary.totalAmount, currency) : '$0.00'}</span>
          {topCategorySummary && (
            <span className="font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              {topCategorySummary.percentage}% of total
            </span>
          )}
        </div>
      </div>

      {/* 4. Average Expense Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Average Expense</span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(averageAmount, currency)}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Per transaction average
        </div>
      </div>

    </div>
  );
}

