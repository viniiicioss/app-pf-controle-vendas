import React, { useState } from 'react';
import { Product, Sale, Tab } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { Reports } from './components/Reports';

/**
 * Componente principal da aplicação de controle de vendas
 */
function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Estado persistente no localStorage
  const [products, setProducts] = useLocalStorage<Product[]>('sales-products', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales-records', []);

  // Handlers para gerenciar produtos
  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const handleUpdateProductQuantity = (productId: string, newQuantity: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, quantity: newQuantity }
        : product
    ));
  };

  // Handler para gerenciar vendas
  const handleAddSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} sales={sales} />;
      
      case 'products':
        return (
          <Products
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        );
      
      case 'inventory':
        return <Inventory products={products} />;
      
      case 'sales':
        return (
          <Sales
            products={products}
            sales={sales}
            onAddSale={handleAddSale}
            onUpdateProductQuantity={handleUpdateProductQuantity}
          />
        );
      
      case 'reports':
        return <Reports products={products} sales={sales} />;
      
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Sistema de Controle de Vendas PF - Desenvolvido para pequenos negócios
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;