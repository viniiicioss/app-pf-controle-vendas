import React from 'react';
import { ShoppingCart, Package, BarChart3, Users, Home } from 'lucide-react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

/**
 * Componente de cabeçalho com navegação por abas
 */
export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Home },
    { id: 'products' as Tab, label: 'Produtos', icon: Package },
    { id: 'inventory' as Tab, label: 'Estoque', icon: BarChart3 },
    { id: 'sales' as Tab, label: 'Vendas', icon: ShoppingCart },
    { id: 'reports' as Tab, label: 'Relatórios', icon: Users },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Sistema de Vendas PF
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Menu mobile */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value as Tab)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};