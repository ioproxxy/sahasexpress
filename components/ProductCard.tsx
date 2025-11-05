import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onViewDetails: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex">
      {stars.map(star => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const hasVariants = product.variantOptions && product.variantOptions.length > 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>(() => {
    if (!hasVariants) return {};
    const initialOptions: {[key: string]: string} = {};
    product.variantOptions!.forEach(opt => {
        initialOptions[opt.name] = opt.values[0];
    });
    return initialOptions;
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null | undefined>(undefined);

  useEffect(() => {
    if(hasVariants) {
        const variant = product.variants?.find(v => {
            return Object.entries(selectedOptions).every(([key, value]) => v.options[key] === value);
        });
        setSelectedVariant(variant || null);
    } else {
        setSelectedVariant(null);
    }
  }, [selectedOptions, product.variants, hasVariants]);

  const stock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
  const isOutOfStock = stock === 0;

  const handleAddToCartClick = () => {
    if (hasVariants && !selectedVariant) {
        alert("This variant is unavailable.");
        return;
    }
    onAddToCart(product, quantity, selectedVariant || undefined);
    setQuantity(1); // Reset quantity after adding to cart
  };
  
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;
  
  const totalReviews = product.reviews?.length || 0;

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
            {isOutOfStock ? 'Out of Stock' : `${stock} left`}
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 space-y-2">
        {hasVariants && (
             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.variantOptions?.map(option => (
                    <div key={option.name}>
                        <label htmlFor={`${product.id}-${option.name}`} className="block text-xs font-medium text-gray-700">{option.name}</label>
                        <select
                            id={`${product.id}-${option.name}`}
                            value={selectedOptions[option.name]}
                            onChange={(e) => handleOptionChange(option.name, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                           {option.values.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        )}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full px-4 py-2 text-white font-semibold rounded-lg bg-gray-400 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {!hasVariants && (
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
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md disabled:cursor-not-allowed disabled:bg-gray-50"
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
            <button
              onClick={handleAddToCartClick}
              className="flex-grow px-4 py-2 text-white font-semibold rounded-lg bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-xs text-textSecondary">
                    ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
            </div>
            <button onClick={() => onViewDetails(product)} className="text-sm font-semibold text-primary hover:text-secondary">
                View Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;