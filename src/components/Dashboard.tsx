import React from 'react';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { Product, Sale } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

/**
 * Componente de dashboard com métricas principais
 */
export const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  // Calcular métricas
  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.quantity <= 5).length;

  const metrics = [
    {
      title: 'Total de Produtos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+0%'
    },
    {
      title: 'Vendas Realizadas',
      value: totalSales.toString(),
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+0%'
    },
    {
      title: 'Faturamento Total',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+0%'
    },
    {
      title: 'Produtos em Baixo Estoque',
      value: lowStockProducts.toString(),
      icon: TrendingUp,
      color: 'bg-red-500',
      change: '⚠️'
    }
  ];

  // Produtos mais vendidos
  const productSales = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.totalPrice;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number; }>);

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">{metric.change} desde o último período</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos Mais Vendidos
          </h3>
          
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map(([productId, data]) => (
                <div key={productId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-500">
                      {data.quantity} unidades vendidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(data.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhuma venda registrada ainda
            </p>
          )}
        </div>

        {/* Produtos com baixo estoque */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos com Baixo Estoque
          </h3>
          
          {products.filter(p => p.quantity <= 5).length > 0 ? (
            <div className="space-y-4">
              {products
                .filter(p => p.quantity <= 5)
                .slice(0, 5)
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.quantity === 0
                          ? 'bg-red-100 text-red-800'
                          : product.quantity <= 3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.quantity} unidades
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Todos os produtos estão com estoque adequado
            </p>
          )}
        </div>
      </div>
    </div>
  );
};