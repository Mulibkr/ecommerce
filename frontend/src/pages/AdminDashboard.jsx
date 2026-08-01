import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, CheckCircle2, ChevronRight, ShoppingBag, Edit, Trash2, Plus, Image } from 'lucide-react';

export default function AdminDashboard({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Navigation: 'orders' or 'products'
  const [activeTab, setActiveTab] = useState('orders');

  // Admin Authentication State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('isAdminLoggedIn') === 'true'
  );
  const [loginError, setLoginError] = useState('');

  // Product CRUD Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'Fruits',
    stock: 10,
    is_trending: false
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '9347758048') {
      setIsLoggedIn(true);
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

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

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        fetchProducts();
      }
    }
  }, [isLoggedIn, activeTab]);

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

  // --- Product Management Actions ---

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: 'Fruits',
      stock: 10,
      is_trending: false
    });
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      category: product.category,
      stock: product.stock,
      is_trending: product.is_trending || false
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
    const method = editingProductId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save product details");
        return res.json();
      })
      .then((savedProduct) => {
        if (editingProductId) {
          setProducts(products.map(p => p.id === editingProductId ? savedProduct : p));
        } else {
          setProducts([savedProduct, ...products]);
        }
        setShowProductForm(false);
      })
      .catch(err => alert(err.message));
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm("Are you sure you want to delete this product from the store catalog?")) return;

    fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts(products.filter(p => p.id !== productId));
      })
      .catch(err => alert(err.message));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-250 text-xs font-bold text-amber-600">Pending</span>;
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

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider hover:text-brand-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </button>
          <div className="flex justify-center pt-4">
            <img
              src="/assets/owner_logo.jpg"
              alt="Bharath Organic Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-md"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Dashboard Login</h1>
          <p className="text-slate-500 text-xs font-light">
            Enter admin details to manage Bharath Organic orders and catalog.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 bg-white shadow-md">
          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-98"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bharath Organic Admin Center</h1>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-3.5 pt-4 text-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'orders' ? 'bg-brand-500 text-white shadow-md' : 'bg-white border border-brand-200 text-slate-700 hover:bg-brand-50'
              }`}
            >
              Orders Fulfillment
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'products' ? 'bg-brand-500 text-white shadow-md' : 'bg-white border border-brand-200 text-slate-700 hover:bg-brand-50'
              }`}
            >
              Manage Products Catalog
            </button>
          </div>
        </div>

        {/* Header Action Button */}
        {activeTab === 'orders' ? (
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-white border border-brand-200 text-brand-700 font-bold text-xs tracking-wider uppercase hover:bg-brand-50 transition-all shadow-sm"
          >
            Refresh Orders
          </button>
        ) : (
          <button 
            onClick={handleOpenAddProduct}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm shadow-brand-500/10"
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !showProductForm ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-light">Syncing data processes...</p>
        </div>
      ) : activeTab === 'orders' ? (
        // --- Orders Dashboard Mode ---
        orders.length === 0 ? (
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
                    <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-2.5">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Name & Email</span>
                        <p className="text-sm font-bold text-slate-800">{selectedOrder.customer_name}</p>
                        <p className="text-xs text-slate-600">{selectedOrder.customer_email}</p>
                      </div>
                      {selectedOrder.delivery_address && (
                        <div className="pt-2 border-t border-brand-200/50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Delivery Address</span>
                          <p className="text-xs text-slate-750 font-semibold whitespace-pre-wrap leading-relaxed">
                            {selectedOrder.delivery_address}
                          </p>
                        </div>
                      )}
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
                <div className="hidden lg:block border-2 border-dashed border-brand-200 rounded-3xl p-12 text-center text-slate-400 bg-white/50">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-60 text-brand-500" />
                  <p className="text-sm">Select an order from the list to view details and update status.</p>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        // --- Products Catalog Mode ---
        <div className="space-y-6">
          {/* Add/Edit Product Form (Inline Card overlay style) */}
          {showProductForm && (
            <div className="p-6 rounded-3xl border border-brand-300 bg-white shadow-xl max-w-2xl mx-auto space-y-6 animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {editingProductId ? 'Edit Product Details' : 'Add New Catalog Item'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Papaya"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="input-field text-sm"
                    >
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Organic Food">Organic Food</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                  <textarea
                    rows="2.5"
                    required
                    placeholder="Describe the product health benefits or sourcing details..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="input-field py-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Price (₹)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="149"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stock Available</label>
                    <input
                      type="number"
                      required
                      placeholder="25"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-3 flex items-center justify-start sm:pt-4.5 pl-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.is_trending}
                        onChange={(e) => setProductForm({ ...productForm, is_trending: e.target.checked })}
                        className="w-4.5 h-4.5 text-brand-500 rounded border-brand-300 focus:ring-brand-500"
                      />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">🔥 Trending Item</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Image URL (Unsplash or Assets)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="flex-1 py-3 rounded-xl border border-brand-200 hover:bg-brand-50 text-slate-500 font-bold text-xs tracking-wider uppercase transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98"
                  >
                    {editingProductId ? 'Update Product' : 'Add to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Items Table grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden p-4 bg-white flex flex-col justify-between gap-4 border border-brand-200/60 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Small Product Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-300"><Image className="w-6 h-6" /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{product.category}</span>
                      {product.is_trending && <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded uppercase">Trending</span>}
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm truncate mt-0.5">{product.name}</h3>
                    <p className="text-xs text-brand-700 font-black mt-1">₹{product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-brand-100/60">
                  <span className="text-xs text-slate-500 font-medium">Stock: <strong className="text-slate-850 font-bold">{product.stock} units</strong></span>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(product)}
                      className="p-2 rounded-lg border border-brand-200 text-slate-500 hover:text-brand-700 hover:bg-brand-50 transition-all"
                      title="Edit Item"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-400 hover:text-red-650 hover:bg-red-50 transition-all"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
