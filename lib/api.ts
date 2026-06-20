import { type UserProfile } from './auth';
import qs from 'qs';

export async function fetchApi(
  endpoint: string,
  params: Record<string, unknown>,
  user: UserProfile | null,
  apiVersion: string = 'api7'
) {
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Allow params to override a/reg (e.g. when switching cabang)
  const requestParams = {
    a: user.app_id,
    reg: user.app_reg,
    ...params,
  };

  // Since Next.js is using output: 'export', API routes don't work in production/Capacitor.
  // We need to call the API directly.
  const BASE_URL_API7 = process.env.NEXT_PUBLIC_BASE_URL_API7 || 'https://api3penjualan.vmedismart.com/';
  const BASE_URL_API5 = process.env.NEXT_PUBLIC_BASE_URL_API5 || 'https://api3.vmedismart.com/';
  
  const baseUrl = apiVersion === 'api5' ? BASE_URL_API5 : BASE_URL_API7;
  const apiUrl = `${baseUrl}${endpoint}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(requestParams || {}),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();
    return json?.data ?? json;
  } else {
    throw new Error('Invalid response from API');
  }
}
