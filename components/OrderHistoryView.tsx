import React, { useState } from 'react';
import { Order, View } from '../types';
import OrderStatusTimeline from './OrderStatusTimeline';

interface OrderHistoryViewProps {
  orders: Order[];
  setView: (view: View) => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, setView }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-textPrimary">No Order History</h2>
        <p className="mt-2 text-textSecondary">You haven't placed any orders yet.</p>
        <button onClick={() => setView(View.Store)} className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary transition-colors">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-textPrimary mb-6">Your Order History</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-surface rounded-lg shadow-md overflow-hidden">
            <div
              className="p-4 flex flex-col sm:flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrderDetails(order.id)}
              role="button"
              aria-expanded={expandedOrderId === order.id}
              aria-controls={`order-details-${order.id}`}
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <p className="font-semibold text-textPrimary">Order ID: {order.id}</p>
                <p className="text-sm text-textSecondary">{order.timestamp.toLocaleDateString()}</p>
              </div>
              <div className="flex-1 text-center">
                <p className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {order.status}
                </p>
              </div>
              <div className="flex-1 text-right font-semibold text-primary">
                Ksh {order.total.toFixed(2)}
              </div>
              <div className="ml-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transition-transform transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {expandedOrderId === order.id && (
              <div id={`order-details-${order.id}`} className="p-4 sm:p-6 border-t border-gray-200">
                <OrderStatusTimeline status={order.status} />
                <h4 className="text-lg font-semibold text-textPrimary mb-4 mt-6">Items</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map(item => {
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryView;