import { 
  Utensils, 
  Plane, 
  ShoppingBag, 
  Tag, 
  Zap, 
  Film, 
  HeartPulse,
  Coffee,
  HelpCircle 
} from 'lucide-react';

export const CATEGORY_CONFIG = {
  Food: {
    label: 'Food',
    icon: Utensils,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    barColor: 'bg-amber-500',
  },
  Travel: {
    label: 'Travel',
    icon: Plane,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    barColor: 'bg-blue-500',
  },
  Shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    barColor: 'bg-purple-500',
  },
  Utilities: {
    label: 'Utilities',
    icon: Zap,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    barColor: 'bg-emerald-500',
  },
  Entertainment: {
    label: 'Entertainment',
    icon: Film,
    color: 'text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    barColor: 'bg-pink-500',
  },
  Health: {
    label: 'Health',
    icon: HeartPulse,
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    barColor: 'bg-rose-500',
  },
  Other: {
    label: 'Other',
    icon: Tag,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    barColor: 'bg-slate-500',
  },
};

export function getCategoryConfig(categoryName) {
  if (!categoryName) return CATEGORY_CONFIG.Other;
  const match = Object.keys(CATEGORY_CONFIG).find(
    (key) => key.toLowerCase() === categoryName.trim().toLowerCase()
  );
  return match ? CATEGORY_CONFIG[match] : CATEGORY_CONFIG.Other;
}

export const formatCurrency = (amount, currency = '$') => {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};
