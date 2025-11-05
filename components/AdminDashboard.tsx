import React, { useState, useEffect, useMemo } from 'react';
import { Product, VariantOption, ProductVariant } from '../types';
import { MOCK_SALES_DATA } from '../constants';
import { generateDescription } from '../services/geminiService';
import EditProductModal from './EditProductModal';
// We need to import SalesChart but it relies on Recharts.
// Let's create a placeholder if it's not available.
// import SalesChart from './SalesChart';

// Dummy chart to avoid breaking if recharts isn't loaded.
const SalesChart: React.FC<{data: any}> = ({data}) => (
    <div className="w-full h-80 p-4 bg-gray-100 rounded-lg flex items-center justify-center text-textSecondary">
        <p>Sales Chart Placeholder. Data for {data.length} months available.</p>
    </div>
);

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <div className="bg-background p-4 rounded-lg shadow-inner">
        <div className="flex items-start justify-between">
            <div>
                <h4 className="text-sm font-medium text-textSecondary">{title}</h4>
                <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
                {icon}
            </div>
        </div>
        {change && (
            <p className={`text-xs mt-2 ${changeType === 'increase' ? 'text-green-600' : 'text-red-500'}`}>
                {change}
            </p>
        )}
    </div>
);


interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onBulkAddProducts: (products: Omit<Product, 'id'>[]) => void;
  onUpdateProduct: (product: Product) => void;
  categories: string[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

type SortableKeys = 'name' | 'price' | 'stock';

const initialNewProductState = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  description: '',
  variantOptions: [] as VariantOption[],
  variants: [] as ProductVariant[],
};

// Helper to generate cartesian product for variants
const getVariantCombinations = (options: VariantOption[]): {[key: string]: string}[] => {
    if (options.length === 0) return [];
    let result: {[key: string]: string}[] = [{}];
    for (const option of options) {
        const newResult: {[key: string]: string}[] = [];
        for (const res of result) {
            for (const value of option.values) {
                newResult.push({ ...res, [option.name]: value });
            }
        }
        result = newResult;
    }
    return result;
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onAddProduct, onBulkAddProducts, onUpdateProduct, categories, onAddCategory, onDeleteCategory }) => {
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys | null; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [newProduct, setNewProduct] = useState(initialNewProductState);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const sortedAndFilteredProducts = useMemo(() => {
    let prods = [...products];

    if (categoryFilter !== 'all') {
      prods = prods.filter(p => p.category === categoryFilter);
    }
    
    if (stockFilter === 'in_stock') {
      prods = prods.filter(p => p.stock > 0);
    } else if (stockFilter === 'out_of_stock') {
      prods = prods.filter(p => p.stock === 0);
    }

    if (sortConfig.key) {
      prods.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
         if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return prods;
  }, [products, categoryFilter, stockFilter, sortConfig]);
  
  const handleSaveProduct = (product: Product) => {
    onUpdateProduct(product);
    setEditingProduct(null);
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Products" value={products.length.toString()} icon={<span>📦</span>} />
        <KpiCard title="Total Categories" value={categories.length.toString()} icon={<span>🏷️</span>} />
        <KpiCard title="Items Out of Stock" value={products.filter(p => p.stock === 0).length.toString()} icon={<span>⚠️</span>} />
        <KpiCard title="Total Stock Value" value={`Ksh ${products.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString()}`} icon={<span>💰</span>} />
      </div>

      {/* Charts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Sales Overview</h2>
            <SalesChart data={MOCK_SALES_DATA} />
        </div>
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Manage Categories</h2>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat} className="flex justify-between items-center text-sm p-2 bg-gray-100 rounded">
                  <span>{cat}</span>
                  <button onClick={() => onDeleteCategory(cat)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New category name" className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md" />
              <button onClick={() => { onAddCategory(newCategoryName); setNewCategoryName(''); }} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-textPrimary">Products</h2>
          <div className="flex items-center gap-4">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
             <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3 cursor-pointer" onClick={() => { /* Implement sort */ }}>Name</th>
                <th className="p-3 cursor-pointer" onClick={() => { /* Implement sort */ }}>Category</th>
                <th className="p-3 cursor-pointer" onClick={() => { /* Implement sort */ }}>Price</th>
                <th className="p-3 cursor-pointer" onClick={() => { /* Implement sort */ }}>Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredProducts.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-textSecondary">{p.category}</td>
                  <td className="p-3 text-textSecondary">Ksh {p.price.toFixed(2)}</td>
                  <td className={`p-3 font-semibold ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.stock}</td>
                  <td className="p-3">
                    <button onClick={() => setEditingProduct(p)} className="text-primary hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <EditProductModal 
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
            categories={categories}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
