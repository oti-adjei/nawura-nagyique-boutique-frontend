import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    console.log('--- [START] Country detection process initiated. ---');
    try {
        // Try to get the real IP address from various headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const clientIp = request.headers.get('x-client-ip');

        console.log(`  > x-forwarded-for: ${forwardedFor || 'not present'}`);
        console.log(`  > x-real-ip: ${realIp || 'not present'}`);
        console.log(`  > x-client-ip: ${clientIp || 'not present'}`);

        // Extract the first IP if there are multiple
        let userIp = forwardedFor?.split(',')[0]?.trim() || realIp || clientIp;

        // For development, use a public IP service to get the actual IP
        if (!userIp || userIp === '127.0.0.1' || userIp === '::1' || userIp.startsWith('192.168.') || userIp.startsWith('10.')) {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                userIp = ipData.ip;
                console.log(`  > SUCCESS! Public IP fetched: ${userIp}`);
            } catch {
                // If we can't get the IP, return null and let the client handle it
                console.log('Could not determine user IP address');
                return NextResponse.json({
                    country: null,
                    message: 'Could not determine location'
                });
            }
        }

        // Use a free IP geolocation service
        const geoResponse = await fetch(`http://ip-api.com/json/${userIp}?fields=status,country,countryCode`);

        if (!geoResponse.ok) {
            throw new Error('Geolocation service unavailable');
        }

        const geoData = await geoResponse.json();
        console.log('  > Raw data received from geolocation service:', geoData);

        if (geoData.status === 'success') {
            return NextResponse.json({
                country: {
                    name: geoData.country,
                    code: geoData.countryCode,
                },
                ip: userIp
            });
        } else {
            throw new Error('Could not determine location from IP');
        }

    } catch (error) {
        console.error('Country detection error:', error);

        // Return a fallback response
        return NextResponse.json({
            country: null,
            message: 'Could not determine location',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 200 }); // Still return 200 since this is expected behavior
    }
}
