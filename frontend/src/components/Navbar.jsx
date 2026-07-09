import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenCart, onSearch, searchQuery, activeCategory, onSelectCategory, categories }) {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-brand-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { onSelectCategory(''); onSearch(''); }}>
            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
              AURA
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
                placeholder="Search products, brands, collections..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-6">
            {/* Quick Category List */}
            <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
              <button
                onClick={() => onSelectCategory('')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCategory === '' ? 'bg-brand-900 text-white border border-brand-800' : 'hover:text-white'
                }`}
              >
                All Goods
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeCategory === cat ? 'bg-brand-900 text-white border border-brand-800' : 'hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-brand-900/60 hover:bg-brand-900 border border-brand-800 hover:border-brand-700 text-slate-200 hover:text-white transition-all shadow-md"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
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
