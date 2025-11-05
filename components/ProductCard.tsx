
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;

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
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-50">
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
