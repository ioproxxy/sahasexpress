import React from 'react';
import { Order } from '../types';
import OrderStatusTimeline from './OrderStatusTimeline';

interface OrderConfirmationProps {
  order: Order | null;
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onContinueShopping }) => {
  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-textPrimary">No order to display.</h2>
        <button onClick={onContinueShopping} className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-secondary transition-colors">
          Go to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-4 text-3xl font-bold text-textPrimary">Thank you for your order!</h1>
        <p className="mt-2 text-textSecondary">Your order has been placed successfully.</p>
        <p className="mt-2 text-sm text-textSecondary">
          Your Order ID is: <span className="font-semibold text-textPrimary bg-gray-200 px-2 py-1 rounded">{order.id}</span>
        </p>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Order Status</h2>
        <OrderStatusTimeline status={order.status} />
        
        <h2 className="text-xl font-semibold text-textPrimary mb-4 border-t pt-6 mt-6">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map(item => {
             const variantDescription = item.variant 
                ? Object.values(item.variant.options).join(', ')
                : '';
            return (
                <li key={item.variant ? item.variant.id : item.id} className="py-4 flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover mr-4" />
                    <div className="flex-grow">
                        <h3 className="font-medium text-textPrimary">{item.name}</h3>
                         {variantDescription && (
                            <p className="text-sm text-textSecondary">{variantDescription}</p>
                        )}
                        <p className="text-sm text-textSecondary">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-textPrimary">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                </li>
            )
          })}
        </ul>
        <div className="border-t pt-4 mt-4 text-right">
            <p className="text-lg font-bold text-textPrimary">Total: <span className="text-primary">Ksh {order.total.toFixed(2)}</span></p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button onClick={onContinueShopping} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-secondary transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
