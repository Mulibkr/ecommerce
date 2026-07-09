import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, CircleAlert, Sparkles } from 'lucide-react';

export default function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm font-light">Loading premium product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-red-400">Error loading product</h2>
        <p className="text-slate-400 text-sm font-light">{error || 'Product could not be loaded.'}</p>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-850 hover:bg-brand-800 text-white font-semibold text-xs uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group py-2"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      {/* Product Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Side: Product Image */}
        <div className="md:col-span-6 rounded-3xl overflow-hidden glass border border-brand-800 p-3 shadow-2xl">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-2xl bg-brand-950/40"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="md:col-span-6 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg glass shadow-sm uppercase tracking-wider text-brand-700">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-850 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-brand-700">₹{product.price.toFixed(2)}</span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-650 uppercase tracking-wider">
                  <CircleAlert className="w-3.5 h-3.5" /> Out of stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-xs font-bold text-emerald-650 uppercase tracking-wider">
                  In stock
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-brand-200/60 pt-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Description</h2>
            <p className="text-slate-600 text-sm font-light mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Actions */}
          {!isOutOfStock && (
            <div className="space-y-4 border-t border-brand-200/60 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-brand-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-brand-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-brand-50 text-slate-500 hover:text-slate-800 disabled:text-slate-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-light">
                  {product.stock} units available
                </span>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-brand-500/15 active:scale-[0.98] transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          )}

          {/* Core Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-200/60 pt-6 text-slate-500 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-brand-200/80">
              <Truck className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Free Delivery</h4>
                <p className="font-light mt-0.5 text-slate-500">Orders over ₹10,000</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-brand-200/80">
              <ShieldCheck className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Freshness Guarantee</h4>
                <p className="font-light mt-0.5 text-slate-500">100% Organic & Handpicked</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-brand-200/80">
              <RefreshCw className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Easy Returns</h4>
                <p className="font-light mt-0.5 text-slate-500">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
