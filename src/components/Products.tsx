import React from 'react';
import { Product } from '../types';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

interface ProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
}

/**
 * Componente principal de gerenciamento de produtos
 */
export const Products: React.FC<ProductsProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produtos</h2>
        <p className="text-gray-600">Gerencie o catálogo de produtos</p>
      </div>

      <ProductForm onAddProduct={onAddProduct} />
      <ProductList 
        products={products} 
        onDeleteProduct={onDeleteProduct}
        onUpdateProduct={onUpdateProduct}
      />
    </div>
  );
};