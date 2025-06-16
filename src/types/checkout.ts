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
    state?: string;
    city?: string;
    postalCode?: string;
    address: string;
  }
  
  export interface Country {
  name: string;
  isoCode: string; // e.g., "US", "CA", "GH"
}

export interface SelectOption {
  label: string; // The text displayed to the user (e.g., "United States", "California")
  value: string; // A unique identifier for the option (e.g., "US", "CA", "12345")
  // You can optionally add a field to carry the full original data object
  // if you need more properties than just 'label' and 'value' in the parent.
  originalData?: any;
}

  export type PaymentMethod = 'bank' | 'paypal' | 'stripe' | 'cash';