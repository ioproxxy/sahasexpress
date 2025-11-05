import React from 'react';
import { Order } from '../types';

interface OrderStatusTimelineProps {
  status: Order['status'];
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ status }) => {
    const statuses: Order['status'][] = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(status);

    return (
        <div className="my-8">
            <div className="flex justify-between items-center relative">
                <div className="absolute top-4 left-0 w-full h-1 bg-gray-300 -z-1">
                    <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" style={{width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`}}></div>
                </div>
                {statuses.map((s, index) => (
                    <div key={s} className="flex-1 flex flex-col items-center z-10">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${index <= currentStatusIndex ? 'bg-primary border-primary text-white' : 'bg-surface border-gray-300 text-gray-600'}`}>
                           {index <= currentStatusIndex ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                           ) : (
                             <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                           )}
                        </div>
                        <p className={`mt-2 text-xs sm:text-sm text-center font-medium ${index <= currentStatusIndex ? 'text-primary' : 'text-textSecondary'}`}>{s}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatusTimeline;