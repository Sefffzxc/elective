import React from 'react';
import InventoryTable from '../components/InventoryTable';

export default function Inventory({ products, onEdit, onDelete, onAdd }) {
  return (
    <InventoryTable
      products={products}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
}
