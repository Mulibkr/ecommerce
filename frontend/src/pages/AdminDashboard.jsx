import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

export default function AdminDashboard({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
      method: 'PATCH'
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then((updatedOrder) => {
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      })
      .catch(err => alert(err.message));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-600">Pending</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600">Processing</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">Shipped</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-250 text-xs font-bold text-emerald-600">Delivered</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-200/60 pb-6">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider hover:text-brand-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Orders Management Processes</h1>
          <p className="text-slate-500 text-sm font-light">
            Monitor and manage live order fulfillment for Bharath Organic.
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-white border border-brand-200 text-brand-700 font-bold text-xs tracking-wider uppercase hover:bg-brand-50 transition-all shadow-sm"
        >
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-light">Loading orders data...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center glass border border-brand-200 rounded-3xl max-w-xl mx-auto space-y-4 bg-white">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Orders Placed Yet</h3>
          <p className="text-slate-500 text-sm font-light max-w-xs mx-auto">
            Once customers start placing orders, they will show up here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Orders ({orders.length})</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    selectedOrder && selectedOrder.id === order.id 
                      ? 'border-brand-500 ring-1 ring-brand-500/20 shadow-md' 
                      : 'border-brand-200/80 hover:border-brand-350 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Order #{order.id}</span>
                      <h3 className="font-extrabold text-slate-800 text-base mt-0.5">{order.customer_name}</h3>
                      <p className="text-xs text-slate-500 font-light mt-0.5">{order.customer_email}</p>
                    </div>
                    <div className="text-right space-y-1.5">
                      <span className="block font-black text-brand-700 text-base">₹{order.total_amount.toFixed(2)}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span className="font-medium flex items-center gap-1 text-brand-700">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Panel */}
          <div className="lg:col-span-5">
            {selectedOrder ? (
              <div className="glass border border-brand-200/60 rounded-3xl p-6 space-y-6 bg-white shadow-md sticky top-24">
                <div className="border-b border-brand-200/60 pb-4">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Process Order Details</span>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-1">Order #{selectedOrder.id}</h3>
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {getStatusBadge(selectedOrder.status)}
                    <span className="text-xs text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Info</h4>
                  <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1">
                    <p className="text-sm font-bold text-slate-800">{selectedOrder.customer_name}</p>
                    <p className="text-xs text-slate-650">{selectedOrder.customer_email}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</h4>
                  <div className="divide-y divide-brand-100 border border-brand-100 rounded-xl overflow-hidden bg-white">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 text-sm">
                        <div>
                          <p className="font-semibold text-slate-800">Product ID: {item.product_id}</p>
                          <p className="text-xs text-slate-500 font-light">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                        </div>
                        <span className="font-extrabold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="p-3 bg-brand-50/30 flex justify-between items-baseline border-t border-brand-100">
                      <span className="text-xs font-bold text-slate-650 uppercase">Total Amount</span>
                      <span className="text-lg font-black text-brand-700">₹{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Actions */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Process Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')}
                      disabled={selectedOrder.status === 'Processing'}
                      className="px-3 py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Process Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                      disabled={selectedOrder.status === 'Shipped'}
                      className="px-3 py-2.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ship Order
                    </button>
                  </div>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                    disabled={selectedOrder.status === 'Delivered'}
                    className="w-full px-3 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed border border-transparent"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:block border-2 border-dashed border-brand-200 rounded-3xl p-12 text-center text-slate-400">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-60" />
                <p className="text-sm">Select an order from the list to view process details and update status.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
