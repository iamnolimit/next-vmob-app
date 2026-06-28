import axios from 'axios';
import https from 'https';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Only allow proxying from vmedis.com
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  if (!parsedUrl.hostname.endsWith('vmedis.com')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const axiosConfig = {
    responseType: 'arraybuffer' as const,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; VmedisApp/1.0)',
      'Accept': 'image/*,*/*',
    },
    timeout: 15000,
  };

  // Try with SSL disabled first, then fallback to default SSL
  let response;
  try {
    response = await axios.get(url, { ...axiosConfig, httpsAgent });
  } catch (err1) {
    console.error('[image-proxy] attempt 1 (no-ssl-verify) failed:', (err1 as Error).message);
    try {
      response = await axios.get(url, axiosConfig);
    } catch (err2) {
      console.error('[image-proxy] attempt 2 (default-ssl) failed:', (err2 as Error).message);
      return new NextResponse(`Failed to fetch image: ${(err2 as Error).message}`, { status: 502 });
    }
  }

  const contentType = String(response.headers['content-type'] || 'image/jpeg');

  return new NextResponse(response.data as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
