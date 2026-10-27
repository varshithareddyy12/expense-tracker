/**
 * API Service for Personal Expense Tracker
 * Automatically connects via Vite proxy (/api) locally or custom VITE_API_BASE_URL in production
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let errorMessage = 'An unexpected error occurred';
      let fieldErrors = null;

      if (data) {
        if (data.fieldErrors) {
          fieldErrors = data.fieldErrors;
          const firstFieldMsg = Object.values(data.fieldErrors)[0];
          errorMessage = firstFieldMsg || data.message || errorMessage;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else {
        errorMessage = `HTTP error ${res.status}: ${res.statusText}`;
      }

      const error = new Error(errorMessage);
      error.status = res.status;
      error.fieldErrors = fieldErrors;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineError = new Error('Cannot connect to backend server. Please verify the backend is running.');
      offlineError.isOffline = true;
      throw offlineError;
    }
    throw err;
  }
}

export const api = {
  // Fetch expenses, with optional category filter and keyword search
  getExpenses: async (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request(`/expenses${query}`);
    return res.data || [];
  },

  // Get a single expense by ID
  getExpenseById: async (id) => {
    const res = await request(`/expenses/${id}`);
    return res.data;
  },

  // Create a new expense
  createExpense: async (expense) => {
    const res = await request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return res;
  },

  // Update an existing expense
  updateExpense: async (id, expense) => {
    const res = await request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
    return res;
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const res = await request(`/expenses/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  // Fetch summary statistics
  getSummary: async () => {
    const res = await request('/expenses/summary');
    return res.data;
  },

  // Fetch distinct categories
  getCategories: async () => {
    const res = await request('/expenses/categories');
    return res.data || [];
  },

  // Health check for backend connectivity
  checkHealth: async () => {
    const res = await request('/health');
    return res;
  },
};

