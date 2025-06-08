// Utilitários para formatação de dados brasileiros

/**
 * Formata um número para moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Converte string de moeda para número
 */
export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

/**
 * Formata data no padrão brasileiro (DD/MM/AAAA)
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Converte data DD/MM/AAAA para ISO string
 */
export const parseDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
};

/**
 * Gera ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};