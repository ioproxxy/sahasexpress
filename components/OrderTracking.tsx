import React, { useState } from 'react';
import { Order } from '../types';
import OrderStatusTimeline from './OrderStatusTimeline';

interface OrderTrackingProps {
  lastOrder: Order | null;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ lastOrder }) => {
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundOrder(null);
    if (lastOrder && orderId === lastOrder.id) {
      setFoundOrder(lastOrder);
    } else {
      setError('Order ID not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-surface rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-textPrimary mb-6 text-center">Track Your Order</h2>
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-secondary transition-colors"
          >
            Track
          </button>
        </form>
        {lastOrder && !orderId && <p className="text-center text-sm text-textSecondary mt-2">Hint: Try your last order ID "{lastOrder.id}"</p>}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        {foundOrder && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-textPrimary">Order Details</h3>
            <div className="mt-4 space-y-2 text-textSecondary">
              <p><strong>Order ID:</strong> {foundOrder.id}</p>
              <p><strong>Total:</strong> Ksh {foundOrder.total.toFixed(2)}</p>
              <p><strong>Date:</strong> {foundOrder.timestamp.toLocaleString()}</p>
              <p><strong>Status:</strong> <span className="font-semibold text-primary">{foundOrder.status}</span></p>
            </div>
            <OrderStatusTimeline status={foundOrder.status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;