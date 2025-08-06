import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch orders from Strapi backend
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    
    if (!strapiUrl) {
      return NextResponse.json(
        { error: 'Strapi URL not configured' },
        { status: 500 }
      );
    }

    // Query Strapi for orders by user email
    const strapiResponse = await fetch(
      `${strapiUrl}/api/orders?filters[customerEmail][$eq]=${session.user.email}&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!strapiResponse.ok) {
      console.error('Strapi response error:', strapiResponse.status, strapiResponse.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch orders from backend' },
        { status: 500 }
      );
    }

    const strapiData = await strapiResponse.json();
    
    // Transform Strapi data to match our frontend interface
    const orders = strapiData.data.map((order: any) => ({
      id: order.id,
      documentId: order.documentId,
      orderNumber: order.orderNumber || `ORD-${order.id}`,
      status: order.status || 'processing',
      total: order.total || 0,
      currency: order.currency || 'CAD',
      createdAt: order.createdAt,
      shippingAddress: {
        name: order.shippingName || order.customerName || '',
        street: order.shippingAddress || '',
        city: order.shippingCity || '',
        province: order.shippingProvince || '',
        postalCode: order.shippingPostalCode || '',
        country: order.shippingCountry || 'Canada',
      },
      items: order.orderItems || order.items || [],
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
