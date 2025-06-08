// Tipos para o sistema de vendas

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  createdAt: string;
}

export interface Customer {
  cpf: string;
  phone: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  customer: Customer;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type Tab = 'dashboard' | 'products' | 'inventory' | 'sales' | 'reports';