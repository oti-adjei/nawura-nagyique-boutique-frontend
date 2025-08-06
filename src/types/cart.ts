export interface CartAdditionItem {
    name: string;
    price: number;
    imageUrl: string;
    weight?: number; // Weight in grams for shipping calculation
    color?: string;
    size?: string | number;
}