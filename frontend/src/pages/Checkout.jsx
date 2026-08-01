import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle2, CircleAlert, CreditCard, Sparkles } from 'lucide-react';

export default function Checkout({ onBackToCatalog }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill in all customer details.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      customer_name: formData.name,
      customer_email: formData.email,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Failed to place order.');
        }
        return data;
      })
      .then((order) => {
        setOrderConfirmation(order);
        clearCart();
        setSubmitting(false);
      })
      .catch((err) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  // Order Complete Screen
  if (orderConfirmation) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-50 border border-emerald-250 rounded-full text-emerald-600 mb-2">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-slate-555 font-light text-sm max-w-sm mx-auto leading-relaxed">
            Thank you for shopping with Bharath. Your order has been registered and is now being processed.
          </p>
        </div>

        <div className="glass border border-brand-200/60 rounded-2xl p-6 text-left space-y-4 bg-white shadow-sm">
          <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider pb-3 border-b border-brand-200/60">
            <span>Order Receipt</span>
            <span className="text-brand-700">ID: #{orderConfirmation.id}</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="flex justify-between text-slate-500"><span className="font-light">Customer:</span> <strong className="text-slate-805 font-bold">{orderConfirmation.customer_name}</strong></p>
            <p className="flex justify-between text-slate-500"><span className="font-light">Email:</span> <strong className="text-slate-805 font-bold">{orderConfirmation.customer_email}</strong></p>
            <p className="flex justify-between text-slate-500"><span className="font-light">Status:</span> <strong className="text-brand-700 font-bold">{orderConfirmation.status}</strong></p>
          </div>
          <div className="pt-3 border-t border-brand-200/60 flex justify-between items-baseline">
            <span className="text-sm text-slate-500 font-light">Amount Charged:</span>
            <span className="text-2xl font-black text-brand-700">₹{orderConfirmation.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onBackToCatalog}
          className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <button 
        onClick={onBackToCatalog}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-700 transition-colors group py-2"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7 glass border border-brand-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Checkout Details</h2>
            <p className="text-slate-550 text-sm mt-1 font-light">
              Please enter your details to complete your order.
            </p>
          </div>

          {error && (
            <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm leading-relaxed">
              <CircleAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2 border-t border-brand-200/60 pt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-550 uppercase tracking-wider pb-2">
                <CreditCard className="w-4 h-4 text-brand-500" /> Payment Details (Simulated)
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                This is a mock transaction. No real credit card or bank details are required. Payment will be automatically cleared on submit.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-brand-500/15 active:scale-[0.98] transition-all"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Place Order & Pay ₹{cartTotal.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 glass border border-brand-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-850 tracking-tight border-b border-brand-200/60 pb-4">Order Summary</h3>

          {cartItems.length === 0 ? (
            <p className="text-slate-500 text-sm font-light">No items in your cart.</p>
          ) : (
            <div className="divide-y divide-brand-100">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg bg-brand-50 border border-brand-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-light">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-850 ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-brand-200/60 pt-6 space-y-4 text-sm">
            <div className="flex justify-between text-slate-500 font-light">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-slate-500 font-light">
              <span>Estimated Tax</span>
              <span className="text-slate-800 font-medium">₹0.00</span>
            </div>
            <div className="border-t border-brand-200/60 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-850">Total Amount</span>
              <span className="text-2xl font-black text-brand-700">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
