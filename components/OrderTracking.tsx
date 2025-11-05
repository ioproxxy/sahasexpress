import React, { useState } from 'react';
import { Order } from '../types';

interface OrderTrackingProps {
  lastOrder: Order | null;
}

const OrderStatusTimeline: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statuses: Order['status'][] = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(status);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center relative">
                {statuses.map((s, index) => (
                    <div key={s} className="flex-1 flex flex-col items-center z-10">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>
                           {index <= currentStatusIndex ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                           ) : index}
                        </div>
                        <p className={`mt-2 text-sm font-medium ${index <= currentStatusIndex ? 'text-primary' : 'text-textSecondary'}`}>{s}</p>
                    </div>
                ))}
                 <div className="absolute top-4 left-0 w-full h-1 bg-gray-300">
                    <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" style={{width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`}}></div>
                </div>
            </div>
        </div>
    );
};

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
        {lastOrder && <p className="text-center text-sm text-textSecondary mt-2">Hint: Try "{lastOrder.id}"</p>}

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
