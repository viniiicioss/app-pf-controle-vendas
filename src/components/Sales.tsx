import React from 'react';
import { Product, Sale } from '../types';
import { SalesForm } from './SalesForm';
import { SalesList } from './SalesList';

interface SalesProps {
  products: Product[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  onUpdateProductQuantity: (productId: string, newQuantity: number) => void;
}

/**
 * Componente principal de gerenciamento de vendas
 */
export const Sales: React.FC<SalesProps> = ({
  products,
  sales,
  onAddSale,
  onUpdateProductQuantity
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendas</h2>
        <p className="text-gray-600">Registre e acompanhe as vendas realizadas</p>
      </div>

      <SalesForm
        products={products}
        onAddSale={onAddSale}
        onUpdateProductQuantity={onUpdateProductQuantity}
      />
      <SalesList sales={sales} />
    </div>
  );
};