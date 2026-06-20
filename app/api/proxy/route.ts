import qs from 'qs';
import { NextResponse } from 'next/server';

const BASE_URL_API7 = process.env.NEXT_PUBLIC_BASE_URL_API7 || 'https://api3penjualan.vmedismart.com/';
const BASE_URL_API5 = process.env.NEXT_PUBLIC_BASE_URL_API5 || 'https://api3.vmedismart.com/';

function getBaseUrl(apiVersion: string): string {
  switch (apiVersion) {
    case 'api5':
      return BASE_URL_API5;
    case 'api7':
    default:
      return BASE_URL_API7;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Target-URL, Target-Version, Target-Options',
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    // Extract headers (matching vmedis-react-app-v3 middleware style)
    const targetVersion = decodeURIComponent(request.headers.get('Target-Version') ?? '');
    const targetUrl = decodeURIComponent(request.headers.get('Target-URL') ?? '');
    const targetOptionsStr = decodeURIComponent(request.headers.get('Target-Options') ?? '{}');

    // Fallback to body params if headers are not provided (for backward compatibility with our current auth.ts)
    const endpoint = targetUrl || requestBody.endpoint;
    const apiVersion = targetVersion || requestBody.apiVersion || 'api7';
    const params = requestBody.params || requestBody;
    
    let options = { method: 'POST' };
    try {
      if (targetOptionsStr && targetOptionsStr !== '{}') {
        options = JSON.parse(targetOptionsStr);
      }
    } catch (e) {
      // ignore parse error
    }

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint or Target-URL header' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    const baseUrl = getBaseUrl(apiVersion);
    const apiUrl = `${baseUrl}${endpoint}`;

    const fetchOptions: RequestInit = {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (options.method !== 'GET') {
      fetchOptions.body = qs.stringify(params || {});
    }

    const response = await fetch(apiUrl, fetchOptions);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (response.status !== 200) {
        console.error('API Error Response:', response.status, data);
      }
      return NextResponse.json({ data }, { 
        status: response.status,
        headers: corsHeaders
      });
    } else {
      const text = await response.text();
      console.error('Non-JSON response from API:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid response from API', details: text.substring(0, 200) },
        { 
          status: response.status,
          headers: corsHeaders
        }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
