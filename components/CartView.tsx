import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-textPrimary">Your cart is empty</h2>
        <p className="mt-2 text-textSecondary">Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-textPrimary mb-6">Your Cart</h2>
      <div className="bg-surface rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item.id} className="p-4 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-textPrimary">{item.name}</h3>
                  <p className="text-textSecondary">Ksh {item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                  <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row items-center justify-between">
          <div className="text-xl font-bold text-textPrimary mb-4 sm:mb-0">
            Subtotal: <span className="text-primary">Ksh {subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
