
import React, { useState } from 'react';

interface CheckoutModalProps {
  onClose: () => void;
  onConfirm: (phone: string) => void;
  isProcessing: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onConfirm, isProcessing }) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length >= 10) {
      onConfirm(phone);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-textPrimary mb-4">M-Pesa Checkout</h2>
        <p className="text-textSecondary mb-6">Enter your M-Pesa phone number to receive a payment prompt.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 254712345678"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Confirm Payment'}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>You will receive an STK push on your phone to complete the payment.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
