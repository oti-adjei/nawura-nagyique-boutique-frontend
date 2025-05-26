// types/index.ts
export interface CartItem {
    id: string | number;
    name: string;
    quantity: number;
    price: number; // Price per unit
    imageUrl: string;
    description?: string; // Optional extra details like '2 pieces'
  }
  
  export interface CheckoutFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    address: string;
  }
  
  export type PaymentMethod = 'bank' | 'paypal' | 'stripe' | 'cash';