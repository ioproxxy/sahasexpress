import React from 'react';
import { Product, ProductVariant } from '../types';
import ProductCard from './ProductCard';

interface WishlistViewProps {
  wishlistedProducts: Product[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onViewDetails: (product: Product) => void;
  wishlist: number[];
}

const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistedProducts,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
  wishlist
}) => {
  if (wishlistedProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-textPrimary">Your wishlist is empty</h2>
        <p className="mt-2 text-textSecondary">Add your favorite items to your wishlist to keep track of them.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-textPrimary mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlist.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;
