import React, { useState } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';

export default function SalesForm({ products, onAddSale }) {
  const [saleForm, setSaleForm] = useState({ 
    productId: '', 
    qty: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [recentSales, setRecentSales] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedProduct = products.find(p => p.id === parseInt(saleForm.productId));

  const handleSubmit = () => {
    if (!saleForm.productId || !saleForm.qty) return;
    
    const product = products.find(p => p.id === parseInt(saleForm.productId));
    if (product && product.stock >= parseInt(saleForm.qty)) {
      const sale = {
        productId: parseInt(saleForm.productId),
        qty: parseInt(saleForm.qty),
        date: saleForm.date,
        total: product.price * parseInt(saleForm.qty)
      };
      onAddSale(sale);
      setRecentSales([{ ...sale, productName: product.name }, ...recentSales.slice(0, 4)]);
      setSaleForm({ productId: '', qty: '', date: new Date().toISOString().split('T')[0] });
    } else {
      alert('Insufficient stock!');
    }
  };

  const handleProductSelect = (productId) => {
    setSaleForm({ ...saleForm, productId: productId.toString() });
    setIsDropdownOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Record New Sale</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
              >
                <span className={selectedProduct ? "text-gray-900" : "text-gray-500"}>
                  {selectedProduct ? `${selectedProduct.name} (Stock: ${selectedProduct.stock})` : "Select a product"}
                </span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {products.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductSelect(p.id)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">Stock: {p.stock} • ₱{p.price.toLocaleString()}</div>
                      </div>
                      {p.stock <= p.minStock && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Low Stock
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 999}
              value={saleForm.qty}
              onChange={(e) => setSaleForm({ ...saleForm, qty: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter quantity"
            />
            {selectedProduct && saleForm.qty && (
              <p className="mt-2 text-sm text-gray-600">
                Total: <span className="font-semibold text-green-600">₱{(selectedProduct.price * parseInt(saleForm.qty || 0)).toLocaleString()}</span>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={saleForm.date}
              onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!saleForm.productId || !saleForm.qty}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingCart size={18} />
            Record Sale
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sales</h2>
        {recentSales.length > 0 ? (
          <div className="space-y-3">
            {recentSales.map((sale, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{sale.productName}</div>
                    <div className="text-sm text-gray-500 mt-1">Qty: {sale.qty} • {sale.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600 text-lg">₱{sale.total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No recent sales recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}