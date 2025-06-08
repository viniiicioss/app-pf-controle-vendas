import React, { useState } from 'react';
import { Plus, X, Minus, ShoppingCart } from 'lucide-react';
import { Product, Sale, SaleItem, Customer } from '../types';
import { maskCPF, maskPhone, maskDate } from '../utils/masks';
import { validateCPF, validatePhone, validateDate } from '../utils/validators';
import { formatCurrency, generateId, formatDate } from '../utils/formatters';

interface SalesFormProps {
  products: Product[];
  onAddSale: (sale: Sale) => void;
  onUpdateProductQuantity: (productId: string, newQuantity: number) => void;
}

/**
 * Componente de formulário para registro de vendas
 */
export const SalesForm: React.FC<SalesFormProps> = ({
  products,
  onAddSale,
  onUpdateProductQuantity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    cpf: '',
    phone: ''
  });
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const availableProducts = products.filter(p => p.quantity > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: maskCPF(value) }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: maskPhone(value) }));
    } else if (name === 'date') {
      setFormData(prev => ({ ...prev, [name]: maskDate(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity === 0) return;

    const existingItem = saleItems.find(item => item.productId === productId);
    
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setSaleItems(prev => prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        ));
      }
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price
      };
      setSaleItems(prev => [...prev, newItem]);
    }
  };

  const updateItemQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, Math.min(product.quantity, item.quantity + change));
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice
        };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (productId: string) => {
    setSaleItems(prev => prev.filter(item => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!validateDate(formData.date)) {
      errors.push('Data inválida. Use o formato DD/MM/AAAA');
    }

    if (!validateCPF(formData.cpf)) {
      errors.push('CPF inválido');
    }

    if (!validatePhone(formData.phone)) {
      errors.push('Telefone inválido');
    }

    if (saleItems.length === 0) {
      errors.push('Adicione pelo menos um produto à venda');
    }

    // Verificar se há estoque suficiente
    for (const item of saleItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        errors.push(`Estoque insuficiente para ${item.productName}`);
      }
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const customer: Customer = {
      cpf: formData.cpf,
      phone: formData.phone
    };

    const newSale: Sale = {
      id: generateId(),
      date: formData.date,
      customer,
      items: saleItems,
      totalAmount: getTotalAmount(),
      createdAt: new Date().toISOString()
    };

    // Atualizar estoque dos produtos
    saleItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        onUpdateProductQuantity(item.productId, product.quantity - item.quantity);
      }
    });

    onAddSale(newSale);

    // Resetar formulário
    setFormData({
      date: formatDate(new Date()),
      cpf: '',
      phone: ''
    });
    setSaleItems([]);
    setErrors([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nova Venda
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Registrar Nova Venda
        </h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setFormData({ date: formatDate(new Date()), cpf: '', phone: '' });
            setSaleItems([]);
            setErrors([]);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados da venda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Venda *
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF do Cliente *
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(99) 99999-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Adicionar produtos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adicionar Produtos
          </label>
          <select
            onChange={(e) => e.target.value && addProduct(e.target.value)}
            value=""
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um produto</option>
            {availableProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {formatCurrency(product.price)} (Estoque: {product.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Lista de produtos selecionados */}
        {saleItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Produtos Selecionados
            </h4>
            <div className="space-y-3">
              {saleItems.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.unitPrice)} por unidade
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.productId, -1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(item.productId, 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900 min-w-[5rem] text-right">
                      {formatCurrency(item.totalPrice)}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(getTotalAmount())}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Finalizar Venda
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({ date: formatDate(new Date()), cpf: '', phone: '' });
              setSaleItems([]);
              setErrors([]);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};