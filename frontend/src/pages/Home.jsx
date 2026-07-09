import React from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Home({ 
  products, 
  onSelectProduct, 
  categories, 
  activeCategory, 
  onSelectCategory, 
  searchQuery, 
  onSearch, 
  sortBy, 
  onSortChange 
}) {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/40 via-brand-850/20 to-brand-950 border border-brand-800/80 px-8 py-16 md:py-24 text-center md:text-left md:px-16 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="space-y-6 max-w-2xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-800 text-xs font-semibold text-brand-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Design & Tech Store
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Elevate Your <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-brand-300 via-white to-brand-500 bg-clip-text text-transparent">Daily Experience</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-lg">
            A premium collection of minimalist workspace items, audio gear, and lifestyle products designed with absolute precision.
          </p>
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <button 
              onClick={() => {
                const element = document.getElementById('catalog');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-brand-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-white/5 active:scale-95 transition-all"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Hero Decorative Image Overlay */}
        <div className="relative w-full max-w-xs md:max-w-md aspect-square rounded-2xl overflow-hidden glass border border-brand-800 shadow-2xl p-2 hidden sm:block animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/60 to-transparent z-10 pointer-events-none" />
          <img
            src="/assets/wireless_headphones.jpg"
            alt="Hero Spotlight"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </section>

      {/* Catalog Filter Header */}
      <section id="catalog" className="scroll-mt-24 space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-brand-800 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Our Catalog</h2>
            <p className="text-slate-400 text-sm mt-1 font-light">
              Showing {products.length} products {activeCategory ? `in ${activeCategory}` : ''}
            </p>
          </div>

          {/* Filters Interface */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Select (Mobile) */}
            <div className="lg:hidden w-full sm:w-auto">
              <select
                value={activeCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sorting Select */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="input-field text-sm bg-brand-900/80 border-brand-800"
              >
                <option value="">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center glass border border-brand-800 rounded-3xl max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-slate-300">No products found</h3>
            <p className="text-slate-500 text-sm font-light max-w-sm mx-auto">
              We couldn't find any products matching your current query. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                onSelectCategory('');
                onSearch('');
                onSortChange('');
              }}
              className="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 font-semibold text-xs text-white uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
