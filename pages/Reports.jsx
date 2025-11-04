import React from 'react';
import ReportCards from '../components/ReportCards';

export default function Reports({ products, sales }) {
  return <ReportCards products={products} sales={sales} />;
}