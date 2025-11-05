import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1">
      <div className="relative pb-[100%]">
        <img className="absolute h-full w-full object-cover" src={product.imageUrl} alt={product.name} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-textPrimary h-14">{product.name}</h3>
        <p className="text-sm text-textSecondary mb-2">{product.category}</p>
        <p className="text-gray-600 text-xs mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-xl font-bold text-primary">Ksh {product.price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-50">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full px-4 py-2 text-white font-semibold rounded-lg bg-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-1 text-center w-12 font-medium" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCartClick}
              className="flex-grow px-4 py-2 text-white font-semibold rounded-lg bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
