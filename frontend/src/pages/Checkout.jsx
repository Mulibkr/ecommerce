import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle2, CircleAlert, CreditCard, Sparkles, MapPin, Truck, Clock } from 'lucide-react';

export default function Checkout({ onBackToCatalog }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    delivery_address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Success screen tracking animation progress
  const [trackProgress, setTrackProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (orderConfirmation && orderConfirmation.status === 'Shipped') {
      interval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 350);
    } else if (orderConfirmation && orderConfirmation.status === 'Delivered') {
      setTrackProgress(100);
    } else {
      setTrackProgress(0);
    }
    return () => clearInterval(interval);
  }, [orderConfirmation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.delivery_address) {
      setError("Please fill in all customer details and delivery address.");
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
      delivery_address: formData.delivery_address,
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
            <p className="flex justify-between text-slate-500"><span className="font-light">Delivery Address:</span> <strong className="text-slate-805 font-bold ml-4 text-right line-clamp-2 max-w-[240px]">{orderConfirmation.delivery_address}</strong></p>
            <p className="flex justify-between text-slate-500"><span className="font-light">Status:</span> <strong className="text-brand-700 font-bold">{orderConfirmation.status}</strong></p>
          </div>
          <div className="pt-3 border-t border-brand-200/60 flex justify-between items-baseline">
            <span className="text-sm text-slate-500 font-light">Amount Charged:</span>
            <span className="text-2xl font-black text-brand-700">₹{orderConfirmation.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Live Location Order Tracking Panel */}
        <div className="glass border border-brand-200/60 rounded-3xl p-6 text-left space-y-5 bg-white shadow-md">
          <div className="border-b border-brand-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Delivery Tracking</h3>
            <span className="text-[9px] font-bold text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full uppercase">Real-Time</span>
          </div>

          {/* Timeline Milestones */}
          <div className="grid grid-cols-4 gap-1 relative pt-2">
            <div className="absolute top-4.5 left-1/8 right-1/8 h-0.5 bg-brand-100 -z-10 rounded-full">
              <div 
                className="h-full bg-brand-500 transition-all duration-500 rounded-full" 
                style={{ 
                  width: orderConfirmation.status === 'Pending' ? '0%' : 
                         orderConfirmation.status === 'Processing' ? '33%' : 
                         orderConfirmation.status === 'Shipped' ? '66%' : '100%' 
                }}
              />
            </div>

            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
              const statusMap = { 'Pending': 1, 'Processing': 2, 'Shipped': 3, 'Delivered': 4 };
              const currentWeight = statusMap[orderConfirmation.status] || 1;
              const isCompleted = currentWeight >= statusMap[step];
              const labels = { 'Pending': 'Placed', 'Processing': 'Packed', 'Shipped': 'Transit', 'Delivered': 'Delivered' };

              return (
                <div key={step} className="flex flex-col items-center text-center space-y-1">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-[10px] transition-all ${
                    isCompleted 
                      ? 'bg-brand-500 border-brand-500 text-white' 
                      : 'bg-white border-brand-200 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    isCompleted ? 'text-brand-700' : 'text-slate-400'
                  }`}>
                    {labels[step]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Simulated Tracking Map */}
          <div className="relative h-36 rounded-2xl border border-brand-200 bg-brand-50/50 overflow-hidden shadow-inner flex flex-col justify-between p-3.5">
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'radial-gradient(circle, #7c3aed 1.5px, transparent 1.5px)', 
              backgroundSize: '20px 20px' 
            }} />

            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-1 bg-white border border-brand-200/80 px-2 py-1 rounded-lg shadow-sm">
                <MapPin className="w-3 h-3 text-brand-600" />
                <span className="text-[9px] font-black text-slate-800 uppercase">Bharath Foods</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-brand-200/80 px-2 py-1 rounded-lg shadow-sm">
                <MapPin className="w-3 h-3 text-red-500 animate-bounce" />
                <span className="text-[9px] font-black text-slate-800 uppercase">Home</span>
              </div>
            </div>

            {/* Path line & vehicle */}
            <div className="relative h-8 w-full flex items-center justify-between border-t border-dashed border-brand-200">
              {orderConfirmation.status === 'Shipped' && (
                <div 
                  className="absolute flex flex-col items-center -top-5 transition-all duration-300 ease-linear"
                  style={{ left: `${trackProgress}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="bg-brand-500 border border-brand-600 p-1 rounded-full shadow text-white animate-pulse">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
              {orderConfirmation.status === 'Delivered' && (
                <div className="absolute flex flex-col items-center -top-5 right-0 translate-x-1/2">
                  <div className="bg-emerald-500 border border-emerald-600 p-1 rounded-full shadow text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
              {orderConfirmation.status !== 'Shipped' && orderConfirmation.status !== 'Delivered' && (
                <div className="w-full text-center text-[10px] text-slate-500 font-light flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-brand-500" />
                  Delivery tracking will activate when admin ships the order.
                </div>
              )}
            </div>

            <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider relative z-10 pt-1 border-t border-brand-100">
              <span>Speed: {orderConfirmation.status === 'Shipped' ? '45 km/h' : '0 km/h'}</span>
              <span>Lat: {orderConfirmation.status === 'Shipped' ? (16.5062 + (trackProgress * 0.001)).toFixed(4) : '16.5062'} | Lng: {orderConfirmation.status === 'Shipped' ? (80.6480 + (trackProgress * 0.001)).toFixed(4) : '80.6480'}</span>
            </div>
          </div>

          {/* Quick Notice */}
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            Keep this screen open to watch live location updates, or copy your Order ID <strong className="text-brand-700 font-black bg-brand-50 px-1 py-0.5 rounded border border-brand-100">#{orderConfirmation.id}</strong> to track it later using the <strong>Track Order</strong> button at the top!
          </p>
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
              <label htmlFor="email" className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Email Address</label>
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

            <div className="space-y-2">
              <label htmlFor="delivery_address" className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Delivery Address</label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                rows="3"
                placeholder="Enter complete house address, area, pincode and landmarks..."
                required
                value={formData.delivery_address}
                onChange={handleInputChange}
                className="input-field py-2.5"
              />
            </div>

            <div className="space-y-4 border-t border-brand-200/60 pt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-650 uppercase tracking-wider pb-1">
                <CreditCard className="w-4 h-4 text-brand-600" /> Payment Details & Instructions
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI Option */}
                <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider">UPI / PhonePe Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700 font-medium">PhonePe: <strong className="text-slate-900 font-black">9347758048</strong></p>
                    <p className="text-sm text-slate-700 font-medium">UPI ID: <strong className="text-slate-900 font-black">9347758048@ybl</strong></p>
                  </div>
                </div>

                {/* Bank Account Option */}
                <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider">Bank Account Details</h4>
                  <div className="space-y-0.5 text-xs text-slate-700">
                    <p>Bank: <strong className="text-slate-900 font-bold">State Bank of India (SBI)</strong></p>
                    <p>Name: <strong className="text-slate-900 font-bold">BHARATH FOODS</strong></p>
                    <p>Account: <strong className="text-slate-900 font-bold">9347758048</strong></p>
                    <p>IFSC Code: <strong className="text-slate-900 font-bold">SBIN0001234</strong></p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Please transfer exactly <strong className="text-brand-700 font-bold">₹{cartTotal.toFixed(2)}</strong> to either the UPI ID or the Bank Account, then click the button below to place your order.
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
