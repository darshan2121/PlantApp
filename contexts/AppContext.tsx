import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Plant, CartItem, Order, User } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  orders: Order[];
  language: 'english' | 'gujarati';
  setLanguage: (lang: 'english' | 'gujarati') => void;
  addToCart: (plant: Plant) => void;
  removeFromCart: (plantId: string) => void;
  updateQuantity: (plantId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  getCartItemCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [language, setLanguage] = useState<'english' | 'gujarati'>('english');

  const addToCart = (plant: Plant) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.plant.id === plant.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.plant.id === plant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { plant, quantity: 1 }];
    });
  };

  const removeFromCart = (plantId: string) => {
    setCart(currentCart => currentCart.filter(item => item.plant.id !== plantId));
  };

  const updateQuantity = (plantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(plantId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.plant.id === plantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders(currentOrders => [order, ...currentOrders]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        orders,
        language,
        setLanguage,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        getCartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};