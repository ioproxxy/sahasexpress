import React, { useState, useEffect } from 'react';
import { Product } from '../types';
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
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onAddProduct, onBulkAddProducts, onUpdateProduct, categories, onAddCategory, onDeleteCategory }) => {
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [newProduct, setNewProduct] = useState(initialNewProductState);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  // Mock data for new KPIs
  const totalSales = 34580;
  const newOrders = 124;
  const siteVisitors = 5000; // Mocked for conversion rate
  const averageOrderValue = newOrders > 0 ? totalSales / newOrders : 0;
  const conversionRate = siteVisitors > 0 ? (newOrders / siteVisitors) * 100 : 0;


  useEffect(() => {
    let processableProducts = [...products];

    // Apply filters
    if (categoryFilter !== 'all') {
      processableProducts = processableProducts.filter(p => p.category === categoryFilter);
    }
    if (stockFilter === 'inStock') {
        processableProducts = processableProducts.filter(p => p.stock > 0);
    } else if (stockFilter === 'outOfStock') {
        processableProducts = processableProducts.filter(p => p.stock === 0);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      processableProducts.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        }
        
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }
    setDisplayedProducts(processableProducts);
  }, [products, sortConfig, categoryFilter, stockFilter]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const handleGenerateDescription = async () => {
    if (!productName || !keywords) {
      alert('Please enter a product name and some keywords.');
      return;
    }
    setIsGenerating(true);
    setGeneratedDesc('');
    try {
      const description = await generateDescription(productName, keywords);
      setGeneratedDesc(description);
    } catch (error) {
      setGeneratedDesc('An error occurred. Please check the console.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const toggleCreateForm = () => {
    const isOpening = !isCreateFormVisible;
    if (isOpening) {
        setNewProduct({
            ...initialNewProductState,
            category: categories.length > 0 ? categories[0] : '',
        });
    }
    setIsCreateFormVisible(isOpening);
  };

  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0 || !newProduct.description || !newProduct.imageUrl) {
      alert('Please fill out all fields. Price must be greater than zero and a category must be selected.');
      return;
    }
    onAddProduct(newProduct);
    setNewProduct(initialNewProductState);
    setIsCreateFormVisible(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setImportMessage(null);
    }
  };

  const handleImportCSV = () => {
    if (!csvFile) return;

    setIsImporting(true);
    setImportMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        const header = lines.shift()?.split(',').map(h => h.trim());
        const requiredHeaders = ['name', 'category', 'price', 'stock', 'imageUrl', 'description'];

        if (!header || !requiredHeaders.every(h => header.includes(h))) {
            throw new Error('Invalid CSV header. Must include: ' + requiredHeaders.join(', '));
        }

        const newProducts: Omit<Product, 'id'>[] = lines.map((line, index) => {
            const values = line.split(',');
            const productData: any = {};
            header.forEach((h, i) => {
                productData[h] = values[i] || '';
            });

            const price = parseFloat(productData.price);
            const stock = parseInt(productData.stock, 10);

            if (!productData.name || isNaN(price) || isNaN(stock) || !productData.imageUrl || !productData.description) {
                throw new Error(`Invalid data on row ${index + 2}. Please check all fields.`);
            }

            return {
                name: productData.name,
                category: productData.category || 'Uncategorized',
                price,
                stock,
                imageUrl: productData.imageUrl,
                description: productData.description,
            };
        });
        
        onBulkAddProducts(newProducts);
        setImportMessage({type: 'success', text: `${newProducts.length} products imported successfully!`});

      } catch (error) {
        if (error instanceof Error) {
            setImportMessage({type: 'error', text: `Import failed: ${error.message}`});
        } else {
            setImportMessage({type: 'error', text: 'An unknown error occurred during import.'});
        }
      } finally {
        setIsImporting(false);
        setCsvFile(null);
        // Reset the file input visually
        const fileInput = document.getElementById('csv-importer') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      }
    };
    reader.onerror = () => {
        setImportMessage({type: 'error', text: 'Failed to read the file.'});
        setIsImporting(false);
    };
    reader.readAsText(csvFile);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategoryName);
    setNewCategoryName('');
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    onUpdateProduct(updatedProduct);
    setEditingProduct(null); // Close modal
  };


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-textPrimary mb-6">Admin Dashboard</h2>

      {/* Performance Overview */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           <KpiCard 
                title="Total Sales"
                value={`Ksh ${totalSales.toLocaleString()}`}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                change="+12.5% vs last month"
                changeType="increase"
            />
            <KpiCard 
                title="New Orders"
                value={newOrders.toString()}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                change="+8.1% vs last month"
                changeType="increase"
            />
            <KpiCard 
                title="Average Order Value"
                value={`Ksh ${averageOrderValue.toFixed(2)}`}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                 change="-1.2% vs last month"
                changeType="decrease"
            />
             <KpiCard 
                title="Conversion Rate"
                value={`${conversionRate.toFixed(2)}%`}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                change={`Based on ${siteVisitors.toLocaleString()} visitors`}
            />
             <KpiCard 
                title="Total Products"
                value={products.length.toString()}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                 change="Live in store"
            />
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">Sales Overview</h3>
        <SalesChart data={MOCK_SALES_DATA} />
      </div>

      {/* AI Description Generator */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">AI Product Description Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name (e.g., Wireless Earbuds)" className="px-3 py-2 border rounded-md" />
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (e.g., bluetooth 5.2, long battery, waterproof)" className="px-3 py-2 border rounded-md" />
        </div>
        <button onClick={handleGenerateDescription} disabled={isGenerating} className="mt-4 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-400">
          {isGenerating ? 'Generating...' : 'Generate with Gemini'}
        </button>
        {generatedDesc && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="font-semibold">Generated Description:</h4>
            <p className="text-textSecondary">{generatedDesc}</p>
          </div>
        )}
      </div>

       {/* Bulk Product Import */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">Bulk Product Import</h3>
        <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="file"
                    id="csv-importer"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <button
                    onClick={handleImportCSV}
                    disabled={!csvFile || isImporting}
                    className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                >
                    {isImporting ? 'Importing...' : 'Import Products'}
                </button>
            </div>
            <div className="text-xs text-textSecondary mt-3">
                <p className="font-semibold">Required CSV Format:</p>
                <p className="font-mono bg-gray-100 p-1 rounded">name,category,price,stock,imageUrl,description</p>
                <p className="mt-1">Ensure the file has a header row with these exact column names.</p>
            </div>
             {importMessage && (
              <div className={`mt-4 p-3 rounded-md text-sm ${importMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {importMessage.text}
              </div>
            )}
        </div>
      </div>
      
       {/* Category Management */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">Manage Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add Category Form */}
            <div>
                <h4 className="font-semibold text-textPrimary mb-2">Add New Category</h4>
                <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400" disabled={!newCategoryName.trim()}>
                        Add
                    </button>
                </form>
            </div>
            {/* Existing Categories List */}
            <div>
                <h4 className="font-semibold text-textPrimary mb-2">Existing Categories</h4>
                {categories.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border rounded-md p-2 bg-background">
                        {categories.map(category => (
                            <div key={category} className="flex justify-between items-center bg-surface p-2 rounded-md shadow-sm">
                                <span className="text-textSecondary">{category}</span>
                                <button onClick={() => onDeleteCategory(category)} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-textSecondary italic">No categories found. Add one to get started.</p>
                )}
            </div>
        </div>
      </div>

      {/* Product Management */}
      <div className="bg-surface p-6 rounded-lg shadow-md">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-textPrimary">Manage Products</h3>
            <button
                onClick={toggleCreateForm}
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${
                isCreateFormVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-secondary'
                }`}
            >
                {isCreateFormVisible ? 'Cancel' : 'Create New Product'}
            </button>
        </div>

        {isCreateFormVisible && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50 transition-all duration-300 ease-in-out">
            <h4 className="text-lg font-semibold text-textPrimary mb-4">New Product Details</h4>
            <form onSubmit={handleSubmitNewProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        disabled={categories.length === 0}
                    >
                        {categories.length === 0 ? (
                            <option>Please add a category first</option>
                        ) : (
                            categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (Ksh)</label>
                    <input type="number" name="price" id="price" value={newProduct.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required min="0.01" step="0.01" />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                    <input type="number" name="stock" id="stock" value={newProduct.stock} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required min="0" />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={newProduct.imageUrl} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="https://example.com/image.jpg" required />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={newProduct.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors" disabled={categories.length === 0}>Save Product</button>
                </div>
            </form>
            </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="flex-1">
                 <label htmlFor="stock-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Stock</label>
                 <select
                    id="stock-filter"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="all">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                 </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                   <button onClick={() => requestSort('name')} className="font-medium uppercase">Product{getSortIndicator('name