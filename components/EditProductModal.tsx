import React, { useState, useEffect, useMemo } from 'react';
import { Product, VariantOption, ProductVariant } from '../types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

// Helper to generate a unique key for a variant's options
const getVariantOptionsKey = (options: { [key: string]: string }): string => {
    return Object.keys(options).sort().map(key => `${key}:${options[key]}`).join('_');
};

// Helper to generate the Cartesian product of variant options
const getVariantCombinations = (options: VariantOption[]): { [key: string]: string }[] => {
    if (!options || options.length === 0 || options.some(o => !o.name.trim() || o.values.length === 0)) return [];
    
    let result: { [key: string]: string }[] = [{}];
    for (const option of options) {
        const newResult: { [key: string]: string }[] = [];
        for (const res of result) {
            for (const value of option.values) {
                newResult.push({ ...res, [option.name]: value });
            }
        }
        result = newResult;
    }
    return result;
};


const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState<Product>(product);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>(product.variantOptions || []);
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
  
  const hasVariants = useMemo(() => variantOptions.length > 0 && variantOptions.some(opt => opt.values.length > 0), [variantOptions]);

  useEffect(() => {
    setFormData(product);
    const specsArray = product.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [];
    setSpecs(specsArray);
    setVariantOptions(product.variantOptions || []);
    setVariants(product.variants || []);
  }, [product]);

  // Regenerate variants when options change
  useEffect(() => {
    // FIX: Explicitly typing the Map to ensure correct type inference for `existingVariant`.
    const existingVariantsMap = new Map<string, ProductVariant>(variants.map(v => [getVariantOptionsKey(v.options), v]));
    const combinations = getVariantCombinations(variantOptions);

    const newVariants = combinations.map((options, index) => {
        const key = getVariantOptionsKey(options);
        const existingVariant = existingVariantsMap.get(key);
        return {
            id: existingVariant?.id || `${product.id}-variant-${index}`,
            options,
            stock: existingVariant?.stock || 0
        };
    });

    setVariants(newVariants);
  }, [variantOptions, product.id]);

  // Update total stock when variants stock changes
  useEffect(() => {
    if (hasVariants) {
        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
        setFormData(prev => ({ ...prev, stock: totalStock }));
    }
  }, [variants, hasVariants]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleRemoveSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  const handleAddVariantOption = () => {
    setVariantOptions([...variantOptions, { name: '', values: [] }]);
  };

  const handleRemoveVariantOption = (index: number) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index));
  };
  
  const handleVariantOptionNameChange = (index: number, name: string) => {
    const newOptions = [...variantOptions];
    newOptions[index].name = name;
    setVariantOptions(newOptions);
  };
  
  const handleVariantOptionValuesChange = (index: number, valuesString: string) => {
    const newOptions = [...variantOptions];
    newOptions[index].values = valuesString.split(',').map(v => v.trim()).filter(Boolean);
    setVariantOptions(newOptions);
  };

  const handleVariantStockChange = (variantIndex: number, stock: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].stock = stock >= 0 ? stock : 0;
    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key.trim()) acc[spec.key.trim()] = spec.value;
      return acc;
    }, {} as { [key: string]: string });
    
    const finalProduct = {
        ...formData,
        specifications: specsObject,
        variantOptions: hasVariants ? variantOptions.filter(opt => opt.name.trim() && opt.values.length > 0) : [],
        variants: hasVariants ? variants : []
    };
    onSave(finalProduct);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 id="edit-product-title" className="text-2xl font-bold text-textPrimary mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Product Name</label><input type="text" name="name" id="edit-name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input" required /></div>
            <div><label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category</label><select name="category" id="edit-category" value={formData.category} onChange={handleChange} className="mt-1 block w-full input" required>{categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
            <div><label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price (Ksh)</label><input type="number" name="price" id="edit-price" value={formData.price} onChange={handleChange} className="mt-1 block w-full input" required min="0.01" step="0.01" /></div>
            <div>
              <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" name="stock" id="edit-stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full input disabled:bg-gray-100" required min="0" disabled={hasVariants} />
              {hasVariants && <p className="text-xs text-gray-500 mt-1">Total stock is auto-calculated from variants.</p>}
            </div>
            <div><label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label><input type="text" name="imageUrl" id="edit-imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full input" required /></div>
            <div className="md:col-span-2"><label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" id="edit-description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input" required></textarea></div>
          </div>
          
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
            <div className="space-y-3">
                {variantOptions.map((option, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                        <div className="flex-grow space-y-2">
                            <input type="text" value={option.name} onChange={(e) => handleVariantOptionNameChange(index, e.target.value)} placeholder="Option Name (e.g., Size)" className="w-full input text-sm" />
                            <input type="text" value={option.values.join(', ')} onChange={(e) => handleVariantOptionValuesChange(index, e.target.value)} placeholder="Comma-separated values (e.g., S, M, L)" className="w-full input text-sm" />
                        </div>
                        <button type="button" onClick={() => handleRemoveVariantOption(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full mt-1" aria-label="Remove variant option"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddVariantOption} className="text-sm font-semibold text-primary hover:text-secondary">+ Add an option</button>
            {hasVariants && variants.length > 0 && (
                 <div className="max-h-60 overflow-y-auto border rounded-md">
                     <table className="w-full text-sm text-left">
                         <thead className="bg-gray-100 sticky top-0">
                             <tr>
                                 {variantOptions.map(opt => opt.name && <th key={opt.name} className="p-2 font-medium">{opt.name}</th>)}
                                 <th className="p-2 font-medium">Stock</th>
                             </tr>
                         </thead>
                         <tbody>
                             {variants.map((variant, index) => (
                                 <tr key={variant.id} className="border-b">
                                     {Object.values(variant.options).map((val, i) => <td key={i} className="p-2">{val}</td>)}
                                     <td className="p-2"><input type="number" value={variant.stock} onChange={(e) => handleVariantStockChange(index, parseInt(e.target.value, 10))} className="w-20 input text-sm" min="0" /></td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
            <div className="space-y-2">{specs.map((spec, index) => (<div key={index} className="flex items-center gap-2"><input type="text" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} placeholder="Attribute" className="flex-1 input text-sm" /><input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="Value" className="flex-1 input text-sm" /><button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label="Remove specification"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" /></svg></button></div>))}</div>
            <button type="button" onClick={handleAddSpec} className="mt-2 text-sm font-semibold text-primary hover:text-secondary">+ Add Specification</button>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
