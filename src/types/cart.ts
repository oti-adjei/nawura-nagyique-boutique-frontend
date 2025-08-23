import { DisplayProduct } from './product';

export interface CartAdditionItem {
    name: string;
    price: number;
    imageUrl: string;
    weight?: number; // Weight in grams for shipping calculation
    color: string;
    size: string;
    quantity: number;
    variantSku?: string;
}

export interface CartItem extends DisplayProduct {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    variantSku?: string;
}