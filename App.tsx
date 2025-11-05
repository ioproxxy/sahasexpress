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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessingPayment, setProcessingPayment] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Default);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);


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

  const getSortedProducts = () => {
    const productsToSort = [...MOCK_PRODUCTS];
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
        return MOCK_PRODUCTS;
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
            ? <AdminDashboard products={MOCK_PRODUCTS} />
            : <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case View.Store:
      default:
        return (
          <div>
            <div className="flex justify-end items-center p-4 sm:px-6 lg:px-8">
               <div className="flex items-center space-x-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 pb-8">
              {getSortedProducts().map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
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
      <footer className="bg-surface text-center p-4 text-textSecondary text-sm border-t">
        <p>&copy; {new Date().getFullYear()} Sahas Express. All rights reserved.</p>
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
