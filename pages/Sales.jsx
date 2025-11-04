import React from 'react';
import SalesForm from '../components/SalesForm';

export default function Sales({ products, onAddSale }) {
  return <SalesForm products={products} onAddSale={onAddSale} />;
}
