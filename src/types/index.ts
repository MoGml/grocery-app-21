export interface User {
  id: string;
  name: string;
  phone: string;
  token?: string;
  countryCode?: number;
  isGuest?: boolean;
}

export interface Address {
  id?: number;
  addressTag: string;
  street?: string;
  building?: string;
  floor?: number;
  appartmentNumber?: number;
  landmark?: string;
  latitude: number;
  longitude: number;
  newContact?: boolean;
  contactPerson?: string;
  contactPersonNumber?: string;
  description: string;
  isDefault?: boolean;
}

export interface GuestAddress {
  fcmToken: string;
  description: string;
  addressTag: string;
  latitude: number;
  longitude: number;
}

export interface GuestAddressResponse {
  addressId: number;
  tag: string;
  description: string;
}

export interface PaginatedAddressResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Address[];
}

export interface Location {
  lat: number;
  lng: number;
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
  packagingId: number;
  name: string;
  pictureUrl: string;
  uomName: string;
  uomValue: number;
  price: number;
  priceAfterDiscount: number;
  discountPercentage: number;
  stockQty: number;
  basketStep: number;
  bagQuantity: number;
}

export interface BrowseProductsResponse {
  categoryName: string | null;
  categoryPicUrl: string | null;
  subCategories: SubCategory[];
  packs: Product[];
  page: number;
  pageSize: number;
  totalProducts: number;
}

export interface BagItem {
  packId: number;
  packName: string;
  pictureUrl: string;
  price: number;
  priceAfterDiscount: number;
  discountPercentage: number;
  unitOfMeasureValue: number;
  unitOfMeasureName: string;
  basketStep: number;
  bagQty: number;
  bagItemComment: string;
  itemOutOfStock: boolean;
  maxQty: number;
}

export interface Bag {
  customerId: number;
  addressId: number;
  bagId: number;
  expressBagItems: BagItem[];
  tomorrowBagItems: BagItem[];
  expressBagSubTotal: number;
  tomorrowsBagSubTotal: number;
  bagSubTotal: number;
}

export interface MutateBagRequest {
  packgingId: number;
  quantity: number;
  comment: string;
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

export interface BagContextType {
  bag: Bag | null;
  loading: boolean;
  error: string | null;
  addToBag: (packagingId: number, quantity: number, comment?: string) => Promise<void>;
  updateBagItem: (packagingId: number, quantity: number, comment?: string) => Promise<void>;
  removeFromBag: (packagingId: number) => Promise<void>;
  refreshBag: () => Promise<void>;
  getBagTotal: () => number;
  getBagCount: () => number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}
