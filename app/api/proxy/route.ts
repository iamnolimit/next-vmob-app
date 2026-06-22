import qs from 'qs';
import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Disable SSL verification — same as vmedis-react-app-v3 middleware
axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

const getBaseUrl = (apiVersion: string): string => {
  switch (apiVersion) {
    case 'api5':
      return process.env.NEXT_PUBLIC_BASE_URL_API5 || 'https://api3.vmedismart.com/';
    case 'apivmart':
      return process.env.NEXT_PUBLIC_BASE_URL_API_MART || '';
    case 'api7':
    default:
      return process.env.NEXT_PUBLIC_BASE_URL_API7 || 'https://api3penjualan.vmedismart.com/';
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Target-URL, Target-Version, Target-Options',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const targetVersion = decodeURIComponent(request.headers.get('Target-Version') ?? '');
    const targetUrl = decodeURIComponent(request.headers.get('Target-URL') ?? '');
    const targetOptionsStr = decodeURIComponent(request.headers.get('Target-Options') ?? '{}');

    const endpoint = targetUrl || requestBody.endpoint;
    const apiVersion = targetVersion || requestBody.apiVersion || 'api7';
    const params = requestBody.params || requestBody;

    if (!endpoint) {
      return NextResponse.json(
        { message: 'Target-Version and Target-URL headers are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    let options: { method?: string } = { method: 'POST' };
    try {
      if (targetOptionsStr && targetOptionsStr !== '{}') {
        options = JSON.parse(targetOptionsStr);
      }
    } catch {
      // ignore parse error, default to POST
    }

    const baseUrl = getBaseUrl(apiVersion);
    const apiEndpoint = `${baseUrl}${endpoint}`;

    const requestData = options.method === 'GET' ? undefined : qs.stringify(params || {});

    const config = {
      url: apiEndpoint,
      method: options.method || 'POST',
      ...(options.method === 'GET' ? { params } : { data: requestData }),
    };

    const apiResponse = await axios(config);

    return NextResponse.json(
      { message: 'Request processed successfully.', data: apiResponse.data },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const axiosError = error as any;
    const statusCode = axiosError?.response?.status || 500;
    const errorData = axiosError?.response?.data || (error instanceof Error ? error.message : 'Unknown error occurred.');

    console.error('[Proxy] Error:', statusCode, errorData);

    return NextResponse.json(
      { message: 'An error occurred.', data: errorData },
      { status: statusCode, headers: corsHeaders }
    );
  }
}
