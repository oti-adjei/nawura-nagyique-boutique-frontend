import { NextRequest, NextResponse } from 'next/server';

// Canada Post API configuration
const CANADA_POST_API_URL = 'https://soa-gw.canadapost.ca/rs/ship/price';
const CANADA_POST_USERNAME = process.env.CANADA_POST_USERNAME;
const CANADA_POST_PASSWORD = process.env.CANADA_POST_PASSWORD;
const CANADA_POST_CUSTOMER_NUMBER = process.env.CANADA_POST_CUSTOMER_NUMBER;

interface ShippingRequest {
  originPostalCode: string;
  destinationPostalCode: string;
  destinationCountry: string;
  destinationProvince?: string;
  weight: number; // in grams
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  serviceCode?: string; // e.g., DOM.RP (Regular Parcel), DOM.EP (Expedited Parcel)
}

interface CanadaPostService {
  serviceName: string;
  serviceCode: string;
  price: number;
  transitTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingRequest = await request.json();
    
    const {
      originPostalCode,
      destinationPostalCode,
      destinationCountry,
      destinationProvince,
      weight,
      length = 20,
      width = 15,
      height = 10,
      serviceCode
    } = body;

    // Validate required fields
    if (!originPostalCode || !destinationPostalCode || !destinationCountry || !weight) {
      return NextResponse.json(
        { error: 'Missing required fields: originPostalCode, destinationPostalCode, destinationCountry, weight' },
        { status: 400 }
      );
    }

    // Check if Canada Post credentials are configured
    if (!CANADA_POST_USERNAME || !CANADA_POST_PASSWORD || !CANADA_POST_CUSTOMER_NUMBER) {
      console.warn('Canada Post credentials not configured, using fallback calculation');
      return getFallbackShipping(destinationCountry, destinationProvince, weight);
    }

    // Build Canada Post API request XML
    const xmlRequest = buildCanadaPostXML({
      originPostalCode,
      destinationPostalCode,
      destinationCountry,
      destinationProvince,
      weight,
      length,
      width,
      height,
      serviceCode
    });

    // Make request to Canada Post API
    const response = await fetch(CANADA_POST_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CANADA_POST_USERNAME}:${CANADA_POST_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
        'Accept': 'application/vnd.cpc.ship.rate-v4+xml'
      },
      body: xmlRequest
    });

    if (!response.ok) {
      console.error('Canada Post API error:', response.status, await response.text());
      return getFallbackShipping(destinationCountry, destinationProvince, weight);
    }

    const xmlResponse = await response.text();
    const services = parseCanadaPostResponse(xmlResponse);

    return NextResponse.json({
      success: true,
      services,
      recommendedService: services[0] // Usually the cheapest or fastest
    });

  } catch (error) {
    console.error('Shipping calculation error:', error);
    
    // Fallback to simple calculation if API fails
    return getFallbackShipping(
      (await request.json()).destinationCountry,
      (await request.json()).destinationProvince,
      (await request.json()).weight
    );
  }
}

function buildCanadaPostXML(params: ShippingRequest & { length: number; width: number; height: number }): string {
  const {
    originPostalCode,
    destinationPostalCode,
    destinationCountry,
    destinationProvince,
    weight,
    length,
    width,
    height,
    serviceCode
  } = params;

  // Determine if it's domestic or international
  const isDomestic = destinationCountry === 'CA';
  const destination = isDomestic 
    ? `<domestic>
         <postal-code>${destinationPostalCode}</postal-code>
       </domestic>`
    : `<united-states>
         <zip-code>${destinationPostalCode}</zip-code>
       </united-states>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
  <customer-number>${CANADA_POST_CUSTOMER_NUMBER}</customer-number>
  <parcel-characteristics>
    <weight>${weight}</weight>
    <dimensions>
      <length>${length}</length>
      <width>${width}</width>
      <height>${height}</height>
    </dimensions>
  </parcel-characteristics>
  <origin>
    <postal-code>${originPostalCode}</postal-code>
  </origin>
  <destination>
    ${destination}
  </destination>
  ${serviceCode ? `<services><service-code>${serviceCode}</service-code></services>` : ''}
</mailing-scenario>`;
}

function parseCanadaPostResponse(xmlResponse: string): CanadaPostService[] {
  // This is a simplified parser. In production, use a proper XML parser like 'fast-xml-parser'
  const services: CanadaPostService[] = [];
  
  // Extract service information from XML response
  // This is a basic regex-based extraction - use proper XML parsing in production
  const serviceMatches = xmlResponse.match(/<price-quote>[\s\S]*?<\/price-quote>/g) || [];
  
  serviceMatches.forEach(serviceXml => {
    const serviceName = serviceXml.match(/<service-name>(.*?)<\/service-name>/)?.[1] || '';
    const serviceCode = serviceXml.match(/<service-code>(.*?)<\/service-code>/)?.[1] || '';
    const priceMatch = serviceXml.match(/<due>([\d.]+)<\/due>/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const transitTime = serviceXml.match(/<expected-delivery-date>(.*?)<\/expected-delivery-date>/)?.[1];
    
    if (serviceName && price > 0) {
      services.push({
        serviceName,
        serviceCode,
        price,
        transitTime
      });
    }
  });

  // Sort by price (cheapest first)
  return services.sort((a, b) => a.price - b.price);
}

function getFallbackShipping(country: string, province?: string, weight: number = 500) {
  // Fallback shipping calculation based on your current logic
  let baseShipping = 15.00;
  
  // Weight-based pricing (per 100g)
  const weightSurcharge = Math.max(0, (weight - 500) / 100) * 2.00;
  
  if (country === 'CA') {
    baseShipping = 12.00 + weightSurcharge;
    
    // Provincial variations
    const provinceTaxes: { [key: string]: number } = {
      'ON': 1.95, 'BC': 1.80, 'QC': 2.25, 'AB': 1.50,
      'NS': 2.10, 'NB': 2.00, 'MB': 1.75, 'SK': 1.65,
      'PE': 2.50, 'NL': 3.00, 'NT': 5.00, 'NU': 6.00, 'YT': 5.50
    };
    
    baseShipping += provinceTaxes[province || ''] || 0;
  } else if (country === 'US') {
    baseShipping = 25.00 + weightSurcharge;
  } else {
    baseShipping = 35.00 + weightSurcharge;
  }

  return NextResponse.json({
    success: true,
    services: [{
      serviceName: 'Standard Shipping',
      serviceCode: 'STANDARD',
      price: parseFloat(baseShipping.toFixed(2)),
      transitTime: country === 'CA' ? '3-5 business days' : '7-14 business days'
    }],
    recommendedService: {
      serviceName: 'Standard Shipping',
      serviceCode: 'STANDARD',
      price: parseFloat(baseShipping.toFixed(2)),
      transitTime: country === 'CA' ? '3-5 business days' : '7-14 business days'
    },
    fallback: true
  });
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Canada Post Shipping API',
    endpoints: {
      POST: '/api/shipping/canada-post',
      description: 'Calculate shipping rates using Canada Post API'
    },
    requiredEnvVars: [
      'CANADA_POST_USERNAME',
      'CANADA_POST_PASSWORD', 
      'CANADA_POST_CUSTOMER_NUMBER'
    ]
  });
}
