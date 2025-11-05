
import React, { useState, useCallback } from 'react';
import { View, Product, CartItem, Order } from './types';
import { MOCK_PRODUCTS } from './constants';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartView from './components/CartView';
import CheckoutModal from './components/CheckoutModal';
import OrderTracking from './components/OrderTracking';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Store);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessingPayment, setProcessingPayment] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
            return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
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
        return <AdminDashboard products={MOCK_PRODUCTS} />;
      case View.Store:
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        );
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} setView={setCurrentView} currentView={currentView} />
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
