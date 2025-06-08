import React from 'react';
import { ShoppingCart, User, Calendar } from 'lucide-react';
import { Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SalesListProps {
  sales: Sale[];
}

/**
 * Componente de listagem de vendas
 */
export const SalesList: React.FC<SalesListProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma venda registrada
        </h3>
        <p className="text-gray-600">
          As vendas aparecerão aqui quando você registrar sua primeira venda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Vendas Realizadas ({sales.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {sales
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((sale) => (
            <div key={sale.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {sale.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {sale.customer.cpf}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Produtos vendidos:</h4>
                    {sale.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-sm text-gray-500 mb-1">Total da Venda</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(sale.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(sale.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};