import { NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Only allow proxying from apt.vmedis.com
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
    const res = await fetch(url, {
      // @ts-expect-error node-fetch agent
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VmedisApp/1.0)',
        'Accept': 'image/*,*/*',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
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
