import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/store/cart/useCart'; // Your CartItem type
import { getProductBySlug } from '@/lib/api'; // Assuming you have a function to get product by ID from Strapi

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil', 
  typescript:true// Use the latest API version
});

// Helper function to calculate order amount securely
async function calculateOrderAmount(items: CartItem[]): Promise<number> {
  let totalAmount = 0;
  for (const item of items) {
    try {
      // IMPORTANT: Fetch product details (especially price) from your backend (Strapi)
      // Do NOT trust prices sent from the client-side.
      const product = await getProductBySlug(item.id.toString()); // Assuming getProductById takes string ID
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }
      totalAmount += product.price * item.quantity;
    } catch (error) {
      console.error(`Error fetching product ${item.id}:`, error);
      throw new Error(`Failed to verify price for product ${item.name}.`);
    }
  }
  return Math.round(totalAmount * 100); // Stripe expects amount in cents
}

export async function POST(request: Request) {
  try {
    const { items, currency = 'usd' } = (await request.json()) as {
      items: CartItem[];
      currency?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const amount = await calculateOrderAmount(items);

    if (amount <= 0) {
        return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    // You can add customer creation/retrieval here if you manage customers in Stripe
    // const customer = await stripe.customers.create({ ... });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true, // Stripe will dynamically show relevant payment methods
      },
      // metadata: { order_id: 'your_internal_order_id' } // Optional: link to your order ID
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}