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

  try {
    const response = await axios.get(url, {
      httpsAgent,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VmedisApp/1.0)',
        'Accept': 'image/*,*/*',
      },
      timeout: 10000,
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';

    return new NextResponse(response.data as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('[image-proxy] error:', err);
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
