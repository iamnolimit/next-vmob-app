import qs from 'qs';
import { NextResponse } from 'next/server';

// main
// const BASE_URL_API7 = process.env.NEXT_PUBLIC_BASE_URL_API7 || 'https://api7lb.vmedis.com/';
// const BASE_URL_API5 = process.env.NEXT_PUBLIC_BASE_URL_API5 || 'https://api3.vmedis.com/';
// mr
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

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, apiVersion = 'api7', params } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const baseUrl = getBaseUrl(apiVersion);
    const apiUrl = `${baseUrl}${endpoint}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(params || {}),
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (response.status !== 200) {
        console.error('API Error Response:', response.status, data);
      }
      return NextResponse.json({ data }, { 
        status: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    } else {
      const text = await response.text();
      console.error('Non-JSON response from API:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid response from API', details: text.substring(0, 200) },
        { 
          status: response.status,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
