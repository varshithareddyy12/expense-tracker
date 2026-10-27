import React from 'react';
import { Edit2, Trash2, Calendar, FileText, PlusCircle, Inbox } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryConfig } from '../utils/categories';

export default function ExpenseCardGrid({ expenses, currency, onEdit, onDelete, onOpenAddModal, hasActiveFilters, onResetFilters }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No expenses found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          {hasActiveFilters
            ? 'No expenses matched your current category or search filters.'
            : 'You have not recorded any expenses yet. Start tracking by adding your first expense.'}
        </p>
        <div className="flex items-center justify-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {expenses.map((expense) => {
        const categoryConfig = getCategoryConfig(expense.category);
        const CategoryIcon = categoryConfig.icon;

        return (
          <div
            key={expense.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryConfig.badge}`}
                >
                  <CategoryIcon className="w-3.5 h-3.5" />
                  <span>{expense.category}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  {formatCurrency(expense.amount, currency)}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                {expense.title}
              </h4>

              {expense.notes && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {expense.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(expense.date)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit expense"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(expense)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

