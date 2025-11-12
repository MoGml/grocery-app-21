export interface User {
  id: string;
  name: string;
  phone: string;
  token?: string;
  countryCode?: number;
  isGuest?: boolean;
}

export interface SubCategory {
  id: number;
  name: string;
  pictureUrl: string;
}

export interface Category {
  id: number;
  name: string;
  pictureUrl: string;
  subCategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  phone: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  checkCustomerExist: (phoneNumber: string, countryCode: number) => Promise<{ isExist: boolean; userName: string }>;
  verifyOTP: (otp: string, phoneNumber: string, countryCode: number) => Promise<boolean>;
  logout: () => void;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}
