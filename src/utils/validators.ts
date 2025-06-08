// Utilitários para validação de dados

import { ValidationError } from '../types';

/**
 * Valida CPF
 */
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Valida telefone
 */
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Valida data no formato DD/MM/AAAA
 */
export const validateDate = (dateStr: string): boolean => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  
  if (!match) return false;
  
  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.getDate() === parseInt(day) &&
         date.getMonth() === parseInt(month) - 1 &&
         date.getFullYear() === parseInt(year);
};

/**
 * Valida produto
 */
export const validateProduct = (product: {
  name: string;
  price: number;
  quantity: number;
  description: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!product.name.trim()) {
    errors.push({ field: 'name', message: 'Nome do produto é obrigatório' });
  }
  
  if (product.price <= 0) {
    errors.push({ field: 'price', message: 'Preço deve ser maior que zero' });
  }
  
  if (product.quantity < 0) {
    errors.push({ field: 'quantity', message: 'Quantidade não pode ser negativa' });
  }
  
  if (!product.description.trim()) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória' });
  }
  
  return errors;
};