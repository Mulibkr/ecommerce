import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 animate-slide-in-right">
          <div className="h-full flex flex-col bg-brand-900 border-l border-brand-800 shadow-2xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-brand-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Shopping Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-brand-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-4 rounded-full bg-brand-950/40 border border-brand-800 mb-4">
                    <ShoppingCart className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-300">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-[200px]">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 rounded-xl bg-brand-950/40 border border-brand-800/80 hover:border-brand-700/60 transition-all group"
                  >
                    {/* Item Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-900 border border-brand-800">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Item Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-brand-300 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-sm font-bold text-white ml-2">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block font-light mt-0.5">
                          ₹{item.price.toFixed(2)} each
                        </span>
                      </div>

                      {/* Item Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-brand-800 rounded-lg bg-brand-950/60 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-brand-800 text-slate-400 hover:text-white transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 hover:bg-brand-800 text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:bg-transparent transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-brand-800 px-6 py-6 space-y-4 bg-brand-950/20">
                <div className="flex justify-between text-base font-medium text-slate-300">
                  <span>Subtotal</span>
                  <span className="text-xl font-black text-white">₹{cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 font-light">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 rounded-xl border border-brand-800 hover:bg-brand-900/60 text-slate-400 hover:text-white font-semibold text-xs tracking-wider uppercase transition-all"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 font-semibold text-xs tracking-wider uppercase text-white shadow-lg shadow-brand-500/10 active:scale-[0.98] transition-all"
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
