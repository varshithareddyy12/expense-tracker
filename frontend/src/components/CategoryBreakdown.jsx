import React from 'react';
import { PieChart, ArrowUpRight } from 'lucide-react';
import { formatCurrency, getCategoryConfig } from '../utils/categories';

export default function CategoryBreakdown({ categoryBreakdowns, totalAmount, currency, selectedCategory, onSelectCategory }) {
  if (!categoryBreakdowns || categoryBreakdowns.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Spending by Category</h2>
        </div>
        <span className="text-xs text-slate-500">Click a category to filter</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categoryBreakdowns.map((cat) => {
          const config = getCategoryConfig(cat.category);
          const Icon = config.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.category.toLowerCase();

          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(isSelected ? 'All' : cat.category)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200/90 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{cat.category}</span>
                </div>
                <span className="text-xs font-bold text-slate-600">{cat.percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{formatCurrency(cat.totalAmount, currency)}</span>
                <span>{cat.count} {cat.count === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

