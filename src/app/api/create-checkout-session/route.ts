import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/store/cart/useCart'; 
import { getProductBySlug } from '@/lib/api'; 
import { getStrapiMedia } from '@/lib/utils';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
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

/**
 * Creates a Stripe Checkout List with a list of cart items.
 * @param items - The array of items from the user's cart.
 * @param currency - The currency for the transaction (defaults to 'usd').
 * @returns A Stripe Checkout Session line items array.
 */
async function createStripeCheckoutList(
  items: CartItem[],
  currency: string = 'cad'
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  // Transform the cart items into Stripe's line_items format.
  // This includes securely fetching the price for each item from your database.
  const lineItems = await Promise.all(
    items.map(async (item) => {
      // SECURITY: Fetch product details from your DB/CMS to get the real price.
      const product = await getProductBySlug(item.id.toString());
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }
      const unitAmount = Math.round(product.price * 100); // Price in cents

      let imageUrls: string[] = []; // Initialize as an empty string array

      if (item.imageUrl) {
        const mediaUrl = getStrapiMedia(item.imageUrl);
        if (typeof mediaUrl === 'string') {
          imageUrls = [mediaUrl];
        }
      }

      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            images: imageUrls.length > 0 ? imageUrls : undefined,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  );

  return lineItems;
}

export async function POST(request: Request) {
  try {
    // Get the request origin for the return_url
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const { items, currency = 'cad' } = (await request.json()) as {
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

    const lineItems = await createStripeCheckoutList(items, currency.toLowerCase());

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Stripe Error: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}