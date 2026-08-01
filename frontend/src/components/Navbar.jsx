import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenCart, onSearch, searchQuery, activeCategory, onSelectCategory, categories }) {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-brand-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer animate-fade-in" onClick={() => { onSelectCategory(''); onSearch(''); }}>
            <img
              src="/assets/owner_logo.jpg"
              alt="Bharath Organics Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-md shadow-brand-500/10"
            />
            <span className="font-extrabold text-xl tracking-wider text-brand-700 font-sans">
              BHARATH ORGANIC
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search organic fruits, veggies, groceries..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-6">
            {/* Quick Category List */}
            <div className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <button
                onClick={() => onSelectCategory('')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeCategory === '' 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10' 
                    : 'hover:bg-brand-100/60 hover:text-brand-750'
                }`}
              >
                All Goods
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    activeCategory === cat 
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10' 
                      : 'hover:bg-brand-100/60 hover:text-brand-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-brand-100/60 hover:bg-brand-100 border border-brand-200 text-brand-700 hover:text-brand-800 transition-all shadow-sm"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
