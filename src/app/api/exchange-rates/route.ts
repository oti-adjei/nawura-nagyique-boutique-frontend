import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use a free exchange rates API with CAD as base currency
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/CAD`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      base: 'CAD',
      rates: data.rates,
      lastUpdated: data.date
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Return fallback rates with CAD as base
    return NextResponse.json({
      base: 'CAD',
      rates: {
        CAD: 1,
        USD: 0.73,
        EUR: 0.68,
        GBP: 0.58,
        AUD: 1.13,
        JPY: 107.50,
        CNY: 5.30,
        INR: 61.20,
        BRL: 3.85,
        MXN: 12.45
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      fallback: true
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache fallback for 5 minutes
      }
    });
  }
}
