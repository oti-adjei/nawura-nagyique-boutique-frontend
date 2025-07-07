'use server'
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
 * @param origin - The request's origin URL for constructing redirect URLs.
 * @param currency - The currency for the transaction (defaults to 'usd').
 * @returns A Stripe Checkout Session object.
 */
/*async function createStripeCheckoutList(
  items: CartItem[],
//   origin: string,
  currency: string = 'usd'
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
// ): Promise<Stripe.Checkout.Session['line_items']> {
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

      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            images:  item.imageUrl ? getStrapiMedia(item.imageUrl) : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  );

  return lineItems

}*/



async function createStripeCheckoutList(
  items: CartItem[],
  //   origin: string,
  currency: string = 'usd'
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
        if (typeof mediaUrl === 'string') { // Ensure getStrapiMedia returns a string
          imageUrls = [mediaUrl]; // Wrap the single URL in an array
        }
        // If getStrapiMedia could return null/undefined, handle that too:
        // if (mediaUrl) {
        //     imageUrls = [mediaUrl];
        // }
      }

      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            images: imageUrls.length > 0 ? imageUrls : undefined, // Provide undefined if empty, or just imageUrls
            // images: imageUrls, // This also works, as an empty array is valid
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  );
  //console.log('lineItems', lineItems);

  return lineItems;
}
// Note the new async function signature for POST requests
export async function POST(request: Request) {
    let lineItemss: Stripe.Checkout.SessionCreateParams.LineItem[]
  try {
    // Get the request origin for the return_url
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // const { items, currency = 'usd' } =  (await request.json()) as {
    const { items } =  (await request.json()) as {
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

        lineItemss = await createStripeCheckoutList(items)

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: lineItemss,
      mode: 'payment',
      // The return_url now points to your new app router page
      // automatic_tax: 'on',
      // automatic_tax: { enabled: true },
      // The return_url now points to your new app router page
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      //  cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Stripe Error: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}