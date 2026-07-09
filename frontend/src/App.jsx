import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'detail', 'checkout'
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch Products whenever filters/sort criteria change
  useEffect(() => {
    setLoading(true);
    let url = '/api/products?';
    if (activeCategory) url += `category=${encodeURIComponent(activeCategory)}&`;
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (sortBy) url += `sort=${encodeURIComponent(sortBy)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [activeCategory, searchQuery, sortBy]);

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  const handleCheckoutRedirect = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleBackToCatalog = () => {
    setSelectedProductId(null);
    setCurrentPage('home');
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-brand-950">
        {/* Navigation Bar */}
        <Navbar
          onOpenCart={handleOpenCart}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            handleBackToCatalog();
          }}
          categories={categories}
        />

        {/* Shopping Cart Drawer overlay */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          onCheckout={handleCheckoutRedirect}
        />

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'home' && (
            loading && products.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-sm font-light">Loading premium products...</p>
              </div>
            ) : (
              <Home
                products={products}
                onSelectProduct={handleSelectProduct}
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )
          )}

          {currentPage === 'detail' && (
            <ProductDetail
              productId={selectedProductId}
              onBack={handleBackToCatalog}
            />
          )}

          {currentPage === 'checkout' && (
            <Checkout
              onBackToCatalog={handleBackToCatalog}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-brand-950 border-t border-brand-900/60 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-900 border border-brand-800 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
              <span className="font-extrabold tracking-wider text-white">AURA MARKET</span>
            </div>
            <p className="text-xs text-slate-500 font-light flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> by Aura Lab. &copy; {new Date().getFullYear()} Aura Inc.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
