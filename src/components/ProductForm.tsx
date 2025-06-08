import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Product, ValidationError } from '../types';
import { maskCurrency } from '../utils/masks';
import { parseCurrency, generateId } from '../utils/formatters';
import { validateProduct } from '../utils/validators';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

/**
 * Componente de formulário para cadastro de produtos
 */
export const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Aplicar máscara de moeda
      setFormData(prev => ({ ...prev, [name]: maskCurrency(value) }));
    } else if (name === 'quantity') {
      // Permitir apenas números
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo quando o usuário digitar
    if (errors.some(error => error.field === name)) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name.trim(),
      price: parseCurrency(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      description: formData.description.trim()
    };

    // Validar dados
    const validationErrors = validateProduct(productData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Criar produto
    const newProduct: Product = {
      id: generateId(),
      ...productData,
      createdAt: new Date().toISOString()
    };

    onAddProduct(newProduct);
    
    // Resetar formulário
    setFormData({
      name: '',
      price: '',
      quantity: '',
      description: ''
    });
    setErrors([]);
    setIsOpen(false);
  };

  const getErrorMessage = (field: string): string => {
    const error = errors.find(e => e.field === field);
    return error ? error.message : '';
  };

  const hasError = (field: string): boolean => {
    return errors.some(e => e.field === field);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Produto
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cadastrar Novo Produto
        </h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setFormData({ name: '', price: '', quantity: '', description: '' });
            setErrors([]);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('name') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o nome do produto"
            />
            {hasError('name') && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage('name')}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço *
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('price') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="R$ 0,00"
            />
            {hasError('price') && (
              <p className="mt-1 text-sm text-red-600">{getErrorMessage('price')}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade em Estoque *
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('quantity') ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {hasError('quantity') && (
            <p className="mt-1 text-sm text-red-600">{getErrorMessage('quantity')}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('description') ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descreva o produto"
          />
          {hasError('description') && (
            <p className="mt-1 text-sm text-red-600">{getErrorMessage('description')}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cadastrar Produto
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setFormData({ name: '', price: '', quantity: '', description: '' });
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