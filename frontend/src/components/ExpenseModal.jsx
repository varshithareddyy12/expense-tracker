import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Calendar, DollarSign, Tag, FileText, AlertCircle } from 'lucide-react';
import { CATEGORY_CONFIG, getCategoryConfig } from '../utils/categories';

export default function ExpenseModal({ isOpen, onClose, onSubmit, expenseToEdit, categories, currency }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(expenseToEdit);

  // Initialize form when opening or changing edit target
  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setTitle(expenseToEdit.title || '');
        setAmount(expenseToEdit.amount ? String(expenseToEdit.amount) : '');
        setCategory(expenseToEdit.category || 'Food');
        setDate(expenseToEdit.date || '');
        setNotes(expenseToEdit.notes || '');
      } else {
        setTitle('');
        setAmount('');
        setCategory('Food');
        setDate(new Date().toISOString().split('T')[0]); // Default to today
        setNotes('');
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, expenseToEdit]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    // Requirement: "Do not accept an empty title or an amount of zero or less"
    if (!title || !title.trim()) {
      newErrors.title = 'Title is required and cannot be empty.';
    } else if (title.trim().length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters.';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Amount is required.';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero.';
    }

    if (!category || !category.trim()) {
      newErrors.category = 'Category is required.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: expenseToEdit?.id,
        title: title.trim(),
        amount: parseFloat(amount),
        category: category.trim(),
        date: date,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setErrors({ general: err.message || 'Failed to save expense.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick category options
  const defaultCategoryOptions = ['Food', 'Travel', 'Shopping', 'Other', 'Utilities', 'Entertainment', 'Health'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditMode ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode ? 'Update expense details' : 'Enter transaction details to track your spending'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Error Alert */}
        {errors.general && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Flight ticket, Grocery store, Coffee..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 transition-all focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Amount & Date 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Amount Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ({currency}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  {currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                  className={`w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 transition-all focus:outline-none focus:ring-2 ${
                    errors.amount
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.amount}</span>
                </p>
              )}
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 transition-all focus:outline-none focus:ring-2 ${
                    errors.date
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.date}</span>
                </p>
              )}
            </div>

          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {defaultCategoryOptions.map((catName) => {
                const config = getCategoryConfig(catName);
                const Icon = config.icon;
                const isSelected = category.toLowerCase() === catName.toLowerCase();

                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => {
                      setCategory(catName);
                      if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                    }}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : config.color}`} />
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.category}</span>
              </p>
            )}
          </div>

          {/* Notes / Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows="2"
              placeholder="Add extra context or description..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEditMode ? 'Update Expense' : 'Save Expense'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
