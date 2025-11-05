import React, { useState, useCallback } from 'react';
import { View, Product, CartItem, Order, SortOption } from './types';
import { MOCK_PRODUCTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartView from './components/CartView';
import CheckoutModal from './components/CheckoutModal';
import OrderTracking from './components/OrderTracking';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Store);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessingPayment, setProcessingPayment] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Default);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>(() => {
    const initialCategories = MOCK_PRODUCTS.map(p => p.category);
    return [...new Set(initialCategories)].sort();
  });


  const addToCart = useCallback((product: Product, quantityToAdd: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        const finalQuantity = Math.min(newQuantity, product.stock);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: finalQuantity } : item
        );
      }
      const finalQuantity = Math.min(quantityToAdd, product.stock);
      return [...prevCart, { ...product, quantity: finalQuantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      const itemToUpdate = prevCart.find(item => item.id === productId);
      if (itemToUpdate && quantity > itemToUpdate.stock) {
          // Do not update if desired quantity exceeds stock
          return prevCart;
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const handleCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleConfirmPayment = (phone: string) => {
    setProcessingPayment(true);
    // Simulate API call
    setTimeout(() => {
      const orderId = `SE${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        customerPhone: phone,
        status: 'Placed',
        timestamp: new Date(),
      };
      setLastOrder(newOrder);
      setCart([]);
      setProcessingPayment(false);
      setCheckoutModalOpen(false);
      alert(`Order placed successfully! Your Order ID is: ${orderId}`);
      // Simulate order status progression
      setTimeout(() => setLastOrder(prev => prev ? {...prev, status: 'Processing'} : null), 10000);
      setTimeout(() => setLastOrder(prev => prev ? {...prev, status: 'Shipped'} : null), 30000);
    }, 2000);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView(View.Store);
    alert("You have been logged out.");
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
        ...newProductData,
        id: Date.now(), // Using timestamp for a simple unique ID
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    alert(`Product "${newProduct.name}" has been added successfully!`);
  };

  const handleBulkAddProducts = (newProductsData: Omit<Product, 'id'>[]) => {
    const productsWithIds: Product[] = newProductsData.map((p, index) => ({
      ...p,
      id: Date.now() + index, // Simple unique ID generation to avoid collisions in quick succession
    }));
    setProducts(prevProducts => [...prevProducts, ...productsWithIds]);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    alert(`Product "${updatedProduct.name}" has been updated successfully!`);
  };


  const handleAddCategory = (categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (trimmedName && !categories.find(c => c.toLowerCase() === trimmedName.toLowerCase())) {
        setCategories(prev => [...prev, trimmedName].sort());
        alert(`Category "${trimmedName}" has been added.`);
    } else {
        alert('Category name cannot be empty or already exists.');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
      const isCategoryInUse = products.some(p => p.category === categoryToDelete);
      if (isCategoryInUse) {
          const confirmDelete = window.confirm(
              `Warning: The category "${categoryToDelete}" is currently in use by one or more products. Deleting it will not remove it from existing products but will prevent it from being assigned to new ones. Do you want to proceed?`
          );
          if (!confirmDelete) return;
      } else {
          const confirmDelete = window.confirm(
            `Are you sure you want to delete the category "${categoryToDelete}"?`
          );
          if (!confirmDelete) return;
      }
      setCategories(prev => prev.filter(c => c !== categoryToDelete));
  };


  const getSortedProducts = () => {
    let productsToSort = [...products];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      productsToSort = productsToSort.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort the filtered products
    switch (sortOption) {
      case SortOption.PriceAsc:
        return productsToSort.sort((a, b) => a.price - b.price);
      case SortOption.PriceDesc:
        return productsToSort.sort((a, b) => b.price - a.price);
      case SortOption.NameAsc:
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case SortOption.NameDesc:
        return productsToSort.sort((a, b) => b.name.localeCompare(a.name));
      case SortOption.Default:
      default:
        return productsToSort;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.Cart:
        return (
          <CartView
            cartItems={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />
        );
      case View.TrackOrder:
        return <OrderTracking lastOrder={lastOrder} />;
      case View.Admin:
        return isAdminLoggedIn
            ? <AdminDashboard
                products={products}
                onAddProduct={handleAddProduct}
                onBulkAddProducts={handleBulkAddProducts}
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateProduct={handleUpdateProduct}
              />
            : <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case View.Store:
      default:
        const displayedProducts = getSortedProducts();
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:px-6 lg:px-8 border-b">
               {/* Search Bar */}
              <div className="relative w-full sm:w-1/2 lg:w-1/3">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                  </span>
                  <input
                      type="search"
                      id="product-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  />
              </div>
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label htmlFor="sort-select" className="text-sm font-medium text-textSecondary">Sort by:</label>
                <select
                    id="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    <option value={SortOption.Default}>Default</option>
                    <option value={SortOption.PriceAsc}>Price: Low to High</option>
                    <option value={SortOption.PriceDesc}>Price: High to Low</option>
                    <option value={SortOption.NameAsc}>Name: A to Z</option>
                    <option value={SortOption.NameDesc}>Name: Z to A</option>
                </select>
              </div>
            </div>

            {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-8">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-semibold text-textPrimary">No Products Found</h2>
                    <p className="mt-2 text-textSecondary">Your search for "{searchQuery}" did not match any products.</p>
                </div>
            )}
          </div>
        );
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        setView={setCurrentView}
        currentView={currentView}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto">
        {renderView()}
      </main>
      <footer className="bg-surface p-4 text-textSecondary text-sm border-t">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Sahas Express. All rights reserved.</p>
            <button
              onClick={() => setCurrentView(View.Admin)}
              className="text-xs text-gray-400 hover:text-primary mt-2 sm:mt-0 transition-colors"
              aria-label="Admin section"
            >
              {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
            </button>
        </div>
      </footer>

      {isCheckoutModalOpen && (
        <CheckoutModal
          onClose={() => setCheckoutModalOpen(false)}
          onConfirm={handleConfirmPayment}
          isProcessing={isProcessingPayment}
        />
      )}
      <WhatsAppButton />
    </div>
  );
};

export default App;