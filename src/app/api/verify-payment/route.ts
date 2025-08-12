// app/api/verify-payment/route.ts
// 'use server'
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.status === 'complete') {
      // Payment was successful and session is complete
      // FULFILL THE ORDER HERE (e.g., update database, send confirmation email)
      return NextResponse.json({ status: 'success', message: 'Payment successful!' });
    } else if (session.status === 'open') {
      // Session is still open (user might have closed tab or not completed payment)
      return NextResponse.json({ status: 'pending', message: 'Payment still pending.' });
    } else if (session.status === 'expired') {
        return NextResponse.json({ status: 'expired', message: 'Payment session expired.' });
    } else {
      // Other statuses like 'no_payment_required' (for free items) or 'unpaid'
      return NextResponse.json({ status: 'failed', message: 'Payment not successful.' });
    }
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return NextResponse.json({ error: 'Failed to verify payment session.' }, { status: 500 });
  }
}