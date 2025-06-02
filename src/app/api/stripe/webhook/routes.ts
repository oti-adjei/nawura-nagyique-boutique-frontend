import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
// import { createOrderInStrapi, updateOrderStatusInStrapi } from '@/lib/api'; // Your functions to interact with Strapi for orders

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript:true
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text(); // Get raw body for signature verification
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!', paymentIntentSucceeded.id);
      // TODO: Fulfill the purchase (e.g., save order to Strapi, send email)
      // Example:
      // const orderDetails = { /* ... extract from paymentIntentSucceeded ... */ };
      // await createOrderInStrapi(orderDetails);
      // await sendOrderConfirmationEmail(paymentIntentSucceeded.receipt_email, orderDetails);
      break;

    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('PaymentIntent failed.', paymentIntentFailed);
      // TODO: Notify customer, log error, etc.
      break;

    case 'checkout.session.completed': // If using Stripe Checkout (not PaymentIntents directly on client)
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout Session completed!', session.id);
        // If you retrieve line items, expand them:
        // const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
        // TODO: Fulfill the purchase using session data
        // const orderId = session.metadata?.order_id;
        // if (orderId) {
        //    await updateOrderStatusInStrapi(orderId, 'paid');
        // }
        break;

    // ... handle other event types
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}