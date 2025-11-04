import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Package, Box } from 'lucide-react';

export default function ReportCards({ products, sales }) {
  const totalSalesTransactions = sales.length;
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.qty, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock).length;

  const cards = [
    { title: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Sales', value: totalSalesTransactions, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Items Sold', value: totalItemsSold, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Inventory Value', value: `₱${totalInventoryValue.toLocaleString()}`, icon: Package, color: 'bg-indigo-500' },
    { title: 'Low Stock Alerts', value: lowStockItems, icon: Box, color: lowStockItems > 0 ? 'bg-red-500' : 'bg-gray-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {sales
              .reduce((acc, sale) => {
                const existing = acc.find(item => item.productId === sale.productId);
                if (existing) {
                  existing.qty += sale.qty;
                  existing.revenue += sale.total;
                } else {
                  acc.push({ productId: sale.productId, qty: sale.qty, revenue: sale.total });
                }
                return acc;
              }, [])
              .sort((a, b) => b.qty - a.qty)
              .slice(0, 5)
              .map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return product ? (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{item.qty} units sold</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">₱{item.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ) : null;
              })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
          {lowStockItems > 0 ? (
            <div className="space-y-3">
              {products
                .filter(p => p.stock <= p.minStock)
                .map((product, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-red-600">Only {product.stock} left</div>
                    </div>
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      Reorder
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">All products well stocked</div>
          )}
        </div>
      </div>
    </div>
  );
}
