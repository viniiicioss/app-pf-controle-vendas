// Hook customizado para localStorage

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar dados no localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Recupera valor inicial do localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para definir valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite função para atualização baseada em valor anterior
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}