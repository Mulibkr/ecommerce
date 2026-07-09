import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CircleAlert } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer group"
      onClick={() => onSelect(product.id)}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden aspect-square bg-brand-950/40">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category Tag */}
        <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-lg glass shadow-sm uppercase tracking-wider text-brand-300">
          {product.category}
        </span>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-red-400 gap-1.5">
            <CircleAlert className="w-8 h-8" />
            <span className="font-bold tracking-wider text-sm uppercase">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Description Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              ₹{product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent opening details
              if (!isOutOfStock) addToCart(product);
            }}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
              isOutOfStock
                ? 'bg-brand-900/40 text-slate-500 cursor-not-allowed border border-transparent'
                : 'bg-brand-500 hover:bg-brand-600 active:scale-95 text-white hover:shadow-brand-500/20'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
