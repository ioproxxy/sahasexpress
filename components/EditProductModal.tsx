import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState<Product>(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 id="edit-product-title" className="text-2xl font-bold text-textPrimary mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" name="name" id="edit-name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" id="edit-category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price (Ksh)</label>
                <input type="number" name="price" id="edit-price" value={formData.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required min="0.01" step="0.01" />
            </div>
            <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="edit-stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required min="0" />
            </div>
            <div>
                <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" name="imageUrl" id="edit-imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="edit-description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                 <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
