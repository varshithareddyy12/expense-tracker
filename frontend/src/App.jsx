import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import CategoryBreakdown from './components/CategoryBreakdown';
import FilterBar from './components/FilterBar';
import ExpenseTable from './components/ExpenseTable';
import ExpenseCardGrid from './components/ExpenseCardGrid';
import ExpenseModal from './components/ExpenseModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Filters and controls
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState('table');
  const [currency, setCurrency] = useState('$');

  // Modals & notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Loading & status
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const showToast = useCallback((type, message, title = '') => {
    setToast({ type, message, title });
  }, []);

  // Fetch all data
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setCheckingHealth(true);

    try {
      // Parallel fetch for expenses, summary, and categories
      const [expensesData, summaryData, categoriesData] = await Promise.all([
        api.getExpenses(),
        api.getSummary(),
        api.getCategories(),
      ]);

      setExpenses(expensesData);
      setSummary(summaryData);
      setCategories(categoriesData);
      setIsBackendOnline(true);
    } catch (err) {
      console.error('Error loading tracker data:', err);
      setIsBackendOnline(false);
      if (isInitial) {
        showToast('error', 'Could not connect to the backend server. Make sure Spring Boot is running on port 8080.', 'Connection Error');
      }
    } finally {
      setIsLoading(false);
      setCheckingHealth(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Handle Add / Edit submit
  const handleSaveExpense = async (formData) => {
    try {
      if (formData.id) {
        // Update existing expense
        const res = await api.updateExpense(formData.id, formData);
        showToast('success', res.message || 'Expense updated successfully!', 'Updated');
      } else {
        // Create new expense
        const res = await api.createExpense(formData);
        showToast('success', res.message || 'Expense recorded successfully!', 'Created');
      }
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to save expense.', 'Error');
      throw err; // Allow modal to handle inline field errors
    }
  };

  // Handle Delete confirm
  const handleDeleteExpense = async (id) => {
    try {
      const res = await api.deleteExpense(id);
      showToast('success', res.message || 'Expense deleted successfully.', 'Deleted');
      await loadData();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete expense.', 'Error');
    }
  };

  // Filtered and Sorted Expenses
  const processedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (e) => e.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('date-desc');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setExpenseToEdit(null);
          setIsModalOpen(true);
        }}
        isBackendOnline={isBackendOnline}
        checkingHealth={checkingHealth}
        onRefresh={() => loadData(false)}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Backend Disconnected Warning Banner */}
        {!isBackendOnline && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Backend Service Unavailable</h4>
                <p className="text-xs text-rose-600">
                  Unable to reach Spring Boot REST API. Ensure the backend server is running on port 8080.
                </p>
              </div>
            </div>
            <button
              onClick={() => loadData(false)}
              disabled={checkingHealth}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* 1. Summary Statistics Cards */}
        <StatCards
          summary={summary}
          currency={currency}
        />

        {/* 2. Visual Category Breakdown */}
        <CategoryBreakdown
          categoryBreakdowns={summary?.categoryBreakdowns || []}
          totalAmount={summary?.totalAmount || 0}
          currency={currency}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 3. Search, Category Filters, Sorting Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          totalFilteredCount={processedExpenses.length}
        />

        {/* 4. Expenses List (Table or Card Grid) */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500">Loading your expenses...</p>
          </div>
        ) : viewMode === 'table' ? (
          <ExpenseTable
            expenses={processedExpenses}
            currency={currency}
            onEdit={(expense) => {
              setExpenseToEdit(expense);
              setIsModalOpen(true);
            }}
            onDelete={(expense) => setExpenseToDelete(expense)}
            onOpenAddModal={() => {
              setExpenseToEdit(null);
              setIsModalOpen(true);
            }}
            hasActiveFilters={selectedCategory !== 'All' || searchQuery.trim() !== ''}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <ExpenseCardGrid
            expenses={processedExpenses}
            currency={currency}
            onEdit={(expense) => {
              setExpenseToEdit(expense);
              setIsModalOpen(true);
            }}
            onDelete={(expense) => setExpenseToDelete(expense)}
            onOpenAddModal={() => {
              setExpenseToEdit(null);
              setIsModalOpen(true);
            }}
            hasActiveFilters={selectedCategory !== 'All' || searchQuery.trim() !== ''}
            onResetFilters={handleResetFilters}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/50 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpendWise &bull; Personal Expense Tracker</span>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>React.js Frontend (Vercel)</span>
            <span>&bull;</span>
            <span>Spring Boot REST API (Render)</span>
            <span>&bull;</span>
            <span>Persistent H2 / PostgreSQL</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSubmit={handleSaveExpense}
        expenseToEdit={expenseToEdit}
        categories={categories}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteExpense}
        expense={expenseToDelete}
        currency={currency}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}

