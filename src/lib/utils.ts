

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}
export function getStrapiToken() {
  return process.env.STRAPI_API_TOKEN;
}

async function fetchStrapi(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: unknown) {
  const token = getStrapiToken();
  const SURL = getStrapiURL();

  if (!SURL) {
    throw new Error("Strapi URL not configured.");
  }

  const url = `${SURL}/api/${endpoint}`;

  console.log("url is " + url)
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json'; // Assuming you'll be sending JSON data
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, config);

    if (!res.ok) {
      console.error(`Failed to fetch from Strapi at ${url}: ${res.status} - ${res.statusText}`);
      // Optionally, you could throw a more specific error here
      throw new Error(`Failed to fetch data from Strapi`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from Strapi at ${url}:`, error);
    throw error;
  }
}

export default fetchStrapi;

// utils/strapi.ts
export function getStrapiMedia(url?: string): string {
  if (!url) return 'https://placehold.co/600x400'; // fallback if url is missing

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) {
    console.error('Strapi base URL not set in env');
    return url; // fallback to relative URL
  }

  // If the URL is already absolute (starts with http), return as is
  if (url.startsWith('http')) return url;

  console.log("the url for Image is " +`${baseUrl}${url}`)

  return `${baseUrl}${url}`;
}
