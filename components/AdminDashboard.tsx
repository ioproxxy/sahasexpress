import React, { useState } from 'react';
import { Product } from '../types';
import { MOCK_SALES_DATA } from '../constants';
import { generateDescription } from '../services/geminiService';
// We need to import SalesChart but it relies on Recharts.
// Let's create a placeholder if it's not available.
// import SalesChart from './SalesChart';

// Dummy chart to avoid breaking if recharts isn't loaded.
const SalesChart: React.FC<{data: any}> = ({data}) => (
    <div className="w-full h-80 p-4 bg-gray-100 rounded-lg flex items-center justify-center text-textSecondary">
        <p>Sales Chart Placeholder. Data for {data.length} months available.</p>
    </div>
);


interface AdminDashboardProps {
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products }) => {
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-textPrimary mb-6">Admin Dashboard</h2>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-textSecondary text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-semibold text-textPrimary mt-2">Ksh 34,580</p>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-textSecondary text-sm font-medium">New Orders</h3>
          <p className="text-3xl font-semibold text-textPrimary mt-2">124</p>
        </div>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h3 className="text-textSecondary text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-semibold text-textPrimary mt-2">{products.length}</p>
        </div>
      </div>
      
      {/* Sales Chart - This will not render properly without recharts loaded from a CDN */}
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

      {/* Product Management */}
      <div className="bg-surface p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-textPrimary mb-4">Manage Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textPrimary">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">Ksh {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
