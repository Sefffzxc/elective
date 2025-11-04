import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]); // still local for now

  // Fetch products from backend API
  const fetchProducts = () => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = async (updatedProduct) => {
    await fetch(`http://localhost:4000/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await fetch(`http://localhost:4000/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  const handleAddProduct = async (newProduct) => {
    await fetch("http://localhost:4000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    fetchProducts();
  };

  const handleAddSale = (newSale) => {
    const id = Math.max(...sales.map(s => s.id), 0) + 1;
    setSales([...sales, { ...newSale, id }]);
    setProducts(products.map(p =>
      p.id === newSale.productId ? { ...p, stock: p.stock - newSale.qty } : p
    ));
  };

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management System</h1>
            <p className="text-gray-500 mt-1">Manage products, sales, and track performance</p>
          </div>
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inventory' && (
          <Inventory
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
          />
        )}
        {activeTab === 'sales' && (
          <Sales products={products} onAddSale={handleAddSale} />
        )}
        {activeTab === 'reports' && (
          <Reports products={products} sales={sales} />
        )}
      </div>
    </div>
  );
}
