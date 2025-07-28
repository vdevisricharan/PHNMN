// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: 'active' | 'inactive' | 'blocked';
  walletBalance: number;
  pointsBalance: number;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id: string;
  type: 'home' | 'office' | 'other';
  fullName: string;
  phone: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  category: string[];
  sizes: string[] | string;
  colors: string[];
  stock: Record<string, number>;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cart Types
export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  addedAt: Date;
}

export interface CartItemPopulated extends Omit<CartItem, 'productId'> {
  productId: Product;
}

// Order Types
export interface OrderItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discountedPrice: number;
}

export interface OrderItemPopulated extends Omit<OrderItem, 'productId'> {
  productId: Product;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItemPopulated[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'wallet' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  pointsEarned: number;
  pointsUsed: number;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutData {
  items: CartItem[];
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: 'card' | 'wallet' | 'cod';
  pointsToUse?: number;
  cardDetails?: {
    token: string;
    last4: string;
  };
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface WishlistItemPopulated extends Omit<WishlistItem, 'productId'> {
  productId: Product;
}

// Transaction Types
export interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}

export interface PointsTransaction {
  _id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}

// Filter and Sort Types
export interface ProductFilters {
  category?: string[];
  priceRange?: { min: number; max: number };
  colors?: string[];
  sizes?: string[];
  rating?: number;
  inStock?: boolean;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'name' | 'createdAt';
  direction: 'asc' | 'desc';
}

// State Types
export interface UserState {
  currentUser: User | null;
  isFetching: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  sort: ProductSort | null;
  isFetching: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  hasInitialized: boolean;
}

export interface CartState {
  items: CartItemPopulated[];
  quantity: number;
  total: number;
  isFetching: boolean;
  error: string | null;
  hasInitialized: boolean;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isFetching: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  checkoutLoading: boolean;
  hasInitialized: boolean;
}

export interface WishlistState {
  items: WishlistItemPopulated[];
  isFetching: boolean;
  error: string | null;
  hasInitialized: boolean;
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  isFetching: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  hasInitialized: boolean;
}

export interface PointsState {
  balance: number;
  transactions: PointsTransaction[];
  isFetching: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  hasInitialized: boolean;
}

export interface AddressState {
  addresses: Address[];
  isFetching: boolean;
  error: string | null;
  hasInitialized: boolean;
} 