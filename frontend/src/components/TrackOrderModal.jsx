import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Truck, CheckCircle2, Clock, Navigation } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchedOrderId, setSearchedOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Simulation variables for live location marker position (percent along route)
  const [progress, setProgress] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);
    setProgress(0);

    fetch(`/api/orders/${orderIdInput.trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found. Please verify the ID.");
        return res.json();
      })
      .then((data) => {
        setOrderData(data);
        setSearchedOrderId(data.id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Animate delivery vehicle icon if Shipped
  useEffect(() => {
    let interval;
    if (orderData && orderData.status === 'Shipped') {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 350);
    } else if (orderData && orderData.status === 'Delivered') {
      setProgress(100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [orderData]);

  if (!isOpen) return null;

  // Timeline milestone checker
  const getStepStatus = (step) => {
    if (!orderData) return 'upcoming';
    const statusMap = {
      'Pending': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4
    };
    const currentWeight = statusMap[orderData.status] || 1;
    const targetWeight = statusMap[step];

    if (currentWeight >= targetWeight) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative glass-card rounded-3xl w-full max-w-2xl bg-white p-6 sm:p-8 space-y-6 shadow-2xl z-10 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-brand-200/60">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-brand-600 animate-spin-slow" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Live Location Tracking</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Order Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Enter your Order ID (e.g. 2)..."
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="input-field pl-4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-xs font-light">Retrieving live tracking coordinates...</p>
          </div>
        ) : orderData ? (
          <div className="space-y-6">
            {/* Timeline Progress */}
            <div className="grid grid-cols-4 gap-2 relative pt-2">
              <div className="absolute top-5 left-1/8 right-1/8 h-1 bg-brand-100 -z-10 rounded-full">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500 rounded-full" 
                  style={{ 
                    width: orderData.status === 'Pending' ? '0%' : 
                           orderData.status === 'Processing' ? '33%' : 
                           orderData.status === 'Shipped' ? '66%' : '100%' 
                  }}
                />
              </div>

              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                const stepStatus = getStepStatus(step);
                const labels = {
                  'Pending': 'Confirmed',
                  'Processing': 'Processing',
                  'Shipped': 'In Transit',
                  'Delivered': 'Delivered'
                };
                return (
                  <div key={step} className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                      stepStatus === 'completed' 
                        ? 'bg-brand-500 border-brand-500 text-white' 
                        : 'bg-white border-brand-200 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      stepStatus === 'completed' ? 'text-brand-700' : 'text-slate-400'
                    }`}>
                      {labels[step]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Tracking Map */}
            <div className="relative h-48 rounded-2xl border border-brand-200 bg-brand-50/50 overflow-hidden shadow-inner flex flex-col justify-between p-4">
              {/* Map Grid Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-100/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 opacity-15" style={{ 
                backgroundImage: 'radial-gradient(circle, #2d5a27 1.5px, transparent 1.5px)', 
                backgroundSize: '24px 24px' 
              }} />

              {/* Start & End Milestones (Bharath Farm and Customer Home) */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-1.5 bg-white border border-brand-200/80 px-2.5 py-1.5 rounded-xl shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-[10px] font-black text-slate-800 uppercase">Bharath Farm</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-brand-200/80 px-2.5 py-1.5 rounded-xl shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                  <span className="text-[10px] font-black text-slate-800 uppercase">Delivery Location</span>
                </div>
              </div>

              {/* Transit Map Path & Vehicle */}
              <div className="relative h-12 w-full flex items-center justify-between border-t-2 border-dashed border-brand-200">
                {orderData.status === 'Shipped' && (
                  <div 
                    className="absolute flex flex-col items-center -top-6 transition-all duration-300 ease-linear"
                    style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="bg-brand-500 border border-brand-600 p-1.5 rounded-full shadow-md text-white animate-pulse">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-brand-700 uppercase tracking-widest mt-1 bg-white px-1 rounded shadow-sm">In Transit</span>
                  </div>
                )}
                {orderData.status === 'Delivered' && (
                  <div className="absolute flex flex-col items-center -top-6 right-0 translate-x-1/2">
                    <div className="bg-emerald-500 border border-emerald-600 p-1.5 rounded-full shadow-md text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-widest mt-1 bg-white px-1 rounded shadow-sm">Arrived</span>
                  </div>
                )}
                {orderData.status !== 'Shipped' && orderData.status !== 'Delivered' && (
                  <div className="w-full text-center text-xs text-slate-500 font-light flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    Vehicle dispatching soon once order status updates to Shipped
                  </div>
                )}
              </div>

              {/* Coordinates / Map location details */}
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider relative z-10 border-t border-brand-100 pt-2">
                <span>Speed: {orderData.status === 'Shipped' ? '45 km/h' : '0 km/h'}</span>
                <span>Lat: {orderData.status === 'Shipped' ? (16.5062 + (progress * 0.001)).toFixed(4) : '16.5062'} | Lng: {orderData.status === 'Shipped' ? (80.6480 + (progress * 0.001)).toFixed(4) : '80.6480'}</span>
              </div>
            </div>

            {/* Location Log Status */}
            <div className="p-4 rounded-2xl bg-brand-50/40 border border-brand-200/60 space-y-2">
              <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider">Live Delivery Logs</h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                {orderData.status === 'Pending' && <p>• [16:54] Order confirmed by customer. Awaiting admin approval.</p>}
                {orderData.status === 'Processing' && (
                  <>
                    <p className="text-slate-500">• [16:54] Order confirmed by customer.</p>
                    <p>• [17:02] Order accepted. Items are being handpicked and packaged at Bharath Organic Farm.</p>
                  </>
                )}
                {orderData.status === 'Shipped' && (
                  <>
                    <p className="text-slate-400">• [16:54] Order confirmed by customer.</p>
                    <p className="text-slate-400">• [17:02] Order packaged at Bharath Organic Farm.</p>
                    <p>• [17:21] Order dispatched from Vijayawada Hub. Delivery executive is in transit to: <strong>{orderData.delivery_address}</strong></p>
                  </>
                )}
                {orderData.status === 'Delivered' && (
                  <>
                    <p className="text-slate-400">• [16:54] Order confirmed by customer.</p>
                    <p className="text-slate-400">• [17:21] Order dispatched from Vijayawada Hub.</p>
                    <p className="text-emerald-600 font-semibold">• [17:28] Delivered. Order successfully handed over to customer at: {orderData.delivery_address}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 font-light text-sm">
            Please enter your unique Order ID above to start tracking.
          </div>
        )}
      </div>
    </div>
  );
}
