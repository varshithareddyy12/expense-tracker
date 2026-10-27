import React from 'react';
import { Edit2, Trash2, Calendar, FileText, PlusCircle, Inbox } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryConfig } from '../utils/categories';

export default function ExpenseTable({ expenses, currency, onEdit, onDelete, onOpenAddModal, hasActiveFilters, onResetFilters }) {
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
          {hasActiveFilters ? (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          ) : null}
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3.5 px-4 sm:px-6">Title & Notes</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Category</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Date</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {expenses.map((expense) => {
              const categoryConfig = getCategoryConfig(expense.category);
              const CategoryIcon = categoryConfig.icon;

              return (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Title & Notes */}
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {expense.title}
                    </div>
                    {expense.notes && (
                      <div className="mt-1 text-xs text-slate-500 flex items-start space-x-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{expense.notes}</span>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 sm:px-6 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryConfig.badge}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      <span>{expense.category}</span>
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 sm:px-6 align-top whitespace-nowrap text-slate-600">
                    <div className="flex items-center space-x-1.5 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap font-bold text-base text-slate-900">
                    {formatCurrency(expense.amount, currency)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer count summary */}
      <div className="py-3 px-4 sm:px-6 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
        <span>Showing <strong>{expenses.length}</strong> {expenses.length === 1 ? 'expense' : 'expenses'}</span>
        <span className="font-semibold text-slate-700">
          Subtotal: {formatCurrency(expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), currency)}
        </span>
      </div>
    </div>
  );
}
