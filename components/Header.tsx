import React from 'react';
import { View } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  setView: (view: View) => void;
  currentView: View;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

const CartIcon: React.FC<{ count: number }> = ({ count }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-textPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

const WishlistIcon: React.FC<{ count: number }> = ({ count }) => (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-textPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );

const NavLink: React.FC<{
  label: string;
  onClick: () => void;
  isActive: boolean;
}> = ({ label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-textPrimary hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);


const Header: React.FC<HeaderProps> = ({ cartCount, wishlistCount, setView, currentView, isAdminLoggedIn, onLogout }) => {
  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 onClick={() => setView(View.Store)} className="text-2xl font-bold text-primary cursor-pointer">Sahas Express</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink label="Store" onClick={() => setView(View.Store)} isActive={currentView === View.Store} />
            <NavLink label="Track Order" onClick={() => setView(View.TrackOrder)} isActive={currentView === View.TrackOrder} />
            <NavLink label="Orders" onClick={() => setView(View.OrderHistory)} isActive={currentView === View.OrderHistory} />
             {isAdminLoggedIn && (
                <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-textPrimary hover:bg-gray-200"
                >
                    Logout
                </button>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            <button onClick={() => setView(View.Wishlist)} className="p-2 rounded-full text-textPrimary hover:bg-gray-200 transition-colors">
              <span className="sr-only">View wishlist</span>
              <WishlistIcon count={wishlistCount} />
            </button>
            <button onClick={() => setView(View.Cart)} className="p-2 rounded-full text-textPrimary hover:bg-gray-200 transition-colors">
              <span className="sr-only">View cart</span>
              <CartIcon count={cartCount} />
            </button>
          </div>
        </div>
      </div>
       <nav className="md:hidden bg-gray-100 p-2 flex justify-around items-center">
            <NavLink label="Store" onClick={() => setView(View.Store)} isActive={currentView === View.Store} />
            <NavLink label="Track Order" onClick={() => setView(View.TrackOrder)} isActive={currentView === View.TrackOrder} />
            <NavLink label="Orders" onClick={() => setView(View.OrderHistory)} isActive={currentView === View.OrderHistory} />
            {isAdminLoggedIn && (
                <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-textPrimary hover:bg-gray-200"
                >
                    Logout
                </button>
            )}
       </nav>
    </header>
  );
};

export default Header;