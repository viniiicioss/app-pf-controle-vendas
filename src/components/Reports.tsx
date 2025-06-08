import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Product, Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ReportsProps {
  products: Product[];
  sales: Sale[];
}

/**
 * Componente de relatórios básicos
 */
export const Reports: React.FC<ReportsProps> = ({ products, sales }) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrar vendas por período
  const filteredSales = sales.filter(sale => {
    if (dateFilter === 'all') return true;
    
    const saleDate = new Date(sale.createdAt);
    const today = new Date();
    
    if (dateFilter === 'today') {
      return saleDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return saleDate >= monthAgo;
    } else if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return saleDate >= start && saleDate <= end;
    }
    
    return true;
  });

  // Calcular métricas
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSalesCount = filteredSales.length;
  const averageTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

  // Produtos mais vendidos
  const productSales = filteredSales.reduce((acc, sale) => {
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
    .slice(0, 10);

  // Vendas por dia (últimos 7 dias)
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dateStr = date.toDateString();
    
    const daySales = sales.filter(sale => 
      new Date(sale.createdAt).toDateString() === dateStr
    );
    
    const revenue = daySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    return {
      day: dayName,
      date: formatDate(date),
      sales: daySales.length,
      revenue
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios</h2>
        <p className="text-gray-600">Análise de vendas e performance</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Filtros de Período</h3>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os períodos</option>
              <option value="today">Hoje</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Último mês</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>
          
          {dateFilter === 'custom' && (
            <>
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg mr-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">{totalSalesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageTicket)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos Mais Vendidos
          </h3>
          
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map(([productId, data], index) => (
                <div key={productId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{data.name}</p>
                      <p className="text-sm text-gray-500">
                        {data.quantity} unidades
                      </p>
                    </div>
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
              Nenhuma venda no período selecionado
            </p>
          )}
        </div>

        {/* Vendas por dia */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vendas por Dia (Últimos 7 dias)
          </h3>
          
          <div className="space-y-4">
            {salesByDay.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{day.day}</p>
                  <p className="text-sm text-gray-500">{day.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {day.sales} vendas
                  </p>
                  <p className="text-sm text-green-600">
                    {formatCurrency(day.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};