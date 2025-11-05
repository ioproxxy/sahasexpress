import React, { useState, useEffect } from 'react';
import { Product, Review, ProductVariant } from '../types';
import { getRecommendedProducts } from '../services/geminiService';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onViewProduct: (product: Product) => void;
  onAddReview: (productId: number, review: Review) => void;
}

const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void; interactive?: boolean }> = ({ rating, onRate, interactive }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex">
      {stars.map(star => (
        <svg
          key={star}
          onClick={interactive ? () => onRate && onRate(star) : undefined}
          className={`h-5 w-5 ${star <= rating ? 'text-amber-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-amber-500' : ''}`}
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

const RecommendedProductCard: React.FC<{ product: Product, onView: () => void }> = ({ product, onView }) => (
    <div onClick={onView} className="cursor-pointer group flex-shrink-0 w-32 sm:w-40 text-center">
        <div className="bg-gray-200 rounded-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <h4 className="text-xs sm:text-sm font-medium mt-2 text-textPrimary truncate">{product.name}</h4>
        <p className="text-sm font-semibold text-primary">Ksh {product.price.toFixed(2)}</p>
    </div>
);

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, allProducts, onClose, onAddToCart, onViewProduct, onAddReview }) => {
    // State for recommendations
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);
    const [errorRecs, setErrorRecs] = useState<string | null>(null);
    
    // State for reviews
    const [newReview, setNewReview] = useState({ author: '', rating: 0, comment: '' });
    
    // State for add to cart logic
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

    useEffect(() => {
        setIsLoadingRecs(true);
        setRecommendations([]);
        setErrorRecs(null);
        setSelectedOptions(() => {
            if (!product.variantOptions || product.variantOptions.length === 0) return {};
            const initialOptions: {[key: string]: string} = {};
            product.variantOptions!.forEach(opt => { initialOptions[opt.name] = opt.values[0]; });
            return initialOptions;
        });
        setQuantity(1);

        const fetchRecommendations = async () => {
            try {
                const recommendedIds = await getRecommendedProducts(product, allProducts);
                const recommendedProducts = allProducts.filter(p => recommendedIds.includes(p.id));
                setRecommendations(recommendedProducts);
            } catch (error) {
                console.error(error);
                setErrorRecs("Could not fetch recommendations.");
            } finally {
                setIsLoadingRecs(false);
            }
        };

        fetchRecommendations();
    }, [product, allProducts]);

    const stock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
    const isOutOfStock = stock === 0;

    const handleAddToCartClick = () => {
        if (hasVariants && !selectedVariant) {
            alert("This variant is unavailable."); return;
        }
        onAddToCart(product, quantity, selectedVariant || undefined);
        alert(`${quantity} x ${product.name} added to cart.`);
    };

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };
    
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.rating > 0 && newReview.comment.trim() && newReview.author.trim()) {
            onAddReview(product.id, newReview);
            setNewReview({ author: '', rating: 0, comment: '' });
        } else {
            alert('Please fill out all fields and provide a rating.');
        }
    };
    
    const totalReviews = product.reviews?.length || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-textPrimary">{product.name}</h2>
                        <p className="text-sm text-textSecondary mt-1 mb-4">{product.category}</p>
                        <p className="text-2xl font-bold text-primary mb-4">Ksh {product.price.toFixed(2)}</p>
                        <p className="text-textSecondary text-base mb-6 flex-grow">{product.description}</p>
                        
                        {hasVariants && (
                             <div className="grid grid-cols-2 gap-4 mb-4">
                                {product.variantOptions?.map(option => (
                                    <div key={option.name}>
                                        <label className="block text-sm font-medium text-gray-700">{option.name}</label>
                                        <select value={selectedOptions[option.name]} onChange={(e) => handleOptionChange(option.name, e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                           {option.values.map(value => <option key={value} value={value}>{value}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <p className={`text-lg font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                {isOutOfStock ? 'Out of Stock' : `${stock} In Stock`}
                            </p>
                        </div>
                        
                        {isOutOfStock ? (
                            <button disabled className="w-full py-3 text-white font-bold rounded-lg bg-gray-400 cursor-not-allowed">Out of Stock</button>
                        ) : (
                            <div className="flex items-stretch gap-2">
                                {!hasVariants && (
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 text-xl font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md" disabled={quantity <= 1}>-</button>
                                        <span className="px-5 py-2 text-lg font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(q => Math.min(stock, q + 1))} className="px-4 text-xl font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md" disabled={quantity >= stock}>+</button>
                                    </div>
                                )}
                                <button onClick={handleAddToCartClick} className="flex-grow bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary transition-colors">Add to Cart</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-background border-t p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-textPrimary mb-4">Customer Reviews ({totalReviews})</h3>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-semibold text-md mb-2 text-textPrimary">Leave a Review</h4>
                                <form onSubmit={handleReviewSubmit} className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Your Rating</label>
                                        <StarRating rating={newReview.rating} onRate={(r) => setNewReview({...newReview, rating: r})} interactive />
                                    </div>
                                    <input type="text" name="author" value={newReview.author} onChange={(e) => setNewReview({...newReview, author: e.target.value})} placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                                    <textarea name="comment" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Your review..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
                                    <button type="submit" className="w-full bg-accent text-white font-semibold text-sm py-2 px-3 rounded-md hover:bg-amber-600">Submit Review</button>
                                </form>
                            </div>
                             <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                {totalReviews > 0 ? (
                                    product.reviews?.map((review, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-3">
                                            <StarRating rating={review.rating} />
                                            <p className="text-sm text-textPrimary my-1.5">"{review.comment}"</p>
                                            <p className="text-xs text-right text-textSecondary">- {review.author}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-textSecondary italic text-center py-4">No reviews yet. Be the first!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold text-textPrimary mb-4">You Might Also Like</h3>
                        {isLoadingRecs && <div className="text-center text-textSecondary">Finding recommendations...</div>}
                        {errorRecs && <div className="text-center text-red-500">{errorRecs}</div>}
                        {!isLoadingRecs && recommendations.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {recommendations.map(rec => (
                                    <div key={rec.id} onClick={() => onViewProduct(rec)} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-200">
                                        <img src={rec.imageUrl} alt={rec.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-textPrimary group-hover:text-primary">{rec.name}</h4>
                                            <p className="text-sm font-semibold text-primary">Ksh {rec.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isLoadingRecs && recommendations.length === 0 && !errorRecs && (
                            <div className="text-center text-textSecondary text-sm py-4">No specific recommendations found.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailModal;
