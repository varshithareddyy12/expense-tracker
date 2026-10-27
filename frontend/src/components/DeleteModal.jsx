import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency, getCategoryConfig } from '../utils/categories';

export default function DeleteModal({ isOpen, onClose, onConfirm, expense, currency }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !expense) return null;

  const config = getCategoryConfig(expense.category);
  const CategoryIcon = config.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(expense.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Delete Expense?
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Are you sure you want to delete this expense record? This action cannot be undone.
        </p>

        {/* Expense Card Preview */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium border ${config.badge}`}>
              <CategoryIcon className="w-3 h-3" />
              <span>{expense.category}</span>
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {formatCurrency(expense.amount, currency)}
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-800 truncate">
            {expense.title}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Date: {expense.date}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Expense</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
