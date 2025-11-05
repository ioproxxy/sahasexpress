import React, { useState } from 'react';
import { Order } from '../types';
import OrderStatusTimeline from './OrderStatusTimeline';

interface OrderTrackingProps {
  orders: Order[];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orders }) => {
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundOrder(null);
    const orderToFind = orders.find(o => o.id === orderId);
    if (orderToFind) {
      setFoundOrder(orderToFind);
    } else {
      setError('Order ID not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-surface rounded-lg shadow-md p-6 sm:p-8">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" />
          </svg>
          <h2 className="text-3xl font-bold text-textPrimary mt-2 mb-2">Track Your Order</h2>
          <p className="text-textSecondary mb-6">
            Enter the Order ID from your confirmation email to see its status.
          </p>
        </div>
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            aria-label="Order ID"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-secondary transition-colors"
          >
            Track
          </button>
        </form>
        {orders.length > 0 && !orderId && <p className="text-center text-sm text-textSecondary mt-2">Hint: Try your last order ID "{orders[0].id}"</p>}

        {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
      </div>

      {foundOrder && (
        <div className="mt-8 bg-surface rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-textPrimary">Order Details</h3>
              <p className="text-textSecondary text-sm">
                Order ID: <span className="font-medium text-textPrimary bg-gray-100 px-2 py-0.5 rounded">{foundOrder.id}</span>
              </p>
              <p className="text-textSecondary text-sm">
                Placed on: {foundOrder.timestamp.toLocaleString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <p className="text-textSecondary text-sm">Status</p>
              <p className="font-bold text-2xl text-primary">{foundOrder.status}</p>
            </div>
          </div>
          
          <OrderStatusTimeline status={foundOrder.status} />

          <div className="border-t pt-6 mt-6">
            <h4 className="text-xl font-semibold text-textPrimary mb-4">Items in your order</h4>
            <ul className="divide-y divide-gray-200">
              {foundOrder.items.map(item => {
                const variantDescription = item.variant ? Object.values(item.variant.options).join(', ') : '';
                return (
                  <li key={item.variant ? item.variant.id : item.id} className="py-4 flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover mr-4 flex-shrink-0" />
                    <div className="flex-grow">
                      <h5 className="font-medium text-textPrimary">{item.name}</h5>
                      {variantDescription && <p className="text-sm text-textSecondary">{variantDescription}</p>}
                      <p className="text-sm text-textSecondary">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-textPrimary text-right">Ksh {(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end items-baseline mt-4 pt-4 border-t">
                <p className="font-bold text-xl text-textPrimary">
                    Total: <span className="text-primary">Ksh {foundOrder.total.toFixed(2)}</span>
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;