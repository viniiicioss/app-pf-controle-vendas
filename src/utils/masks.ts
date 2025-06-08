// Utilitários para máscaras de input

/**
 * Aplica máscara de CPF (999.999.999-99)
 */
export const maskCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
  
  if (!match) return value;
  
  const [, p1, p2, p3, p4] = match;
  let result = p1;
  
  if (p2) result += `.${p2}`;
  if (p3) result += `.${p3}`;
  if (p4) result += `-${p4}`;
  
  return result;
};

/**
 * Aplica máscara de telefone ((99) 99999-9999)
 */
export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  
  if (!match) return value;
  
  const [, ddd, part1, part2] = match;
  let result = '';
  
  if (ddd) result += `(${ddd}`;
  if (ddd.length === 2) result += ') ';
  if (part1) result += part1;
  if (part2) result += `-${part2}`;
  
  return result;
};

/**
 * Aplica máscara de data (DD/MM/AAAA)
 */
export const maskDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  
  if (!match) return value;
  
  const [, day, month, year] = match;
  let result = day;
  
  if (month) result += `/${month}`;
  if (year) result += `/${year}`;
  
  return result;
};

/**
 * Aplica máscara de moeda (R$ 9.999,99)
 */
export const maskCurrency = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const numValue = parseInt(cleanValue) / 100;
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
};