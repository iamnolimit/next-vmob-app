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

  // Use absolute URL in Capacitor, relative in browser
  const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? '' 
    : 'https://cheery-dragon-8e5b5a.netlify.app';

  const response = await fetch(`${baseUrl}/api/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': encodeURIComponent(endpoint),
      'Target-Version': encodeURIComponent(apiVersion),
      'Target-Options': encodeURIComponent(JSON.stringify({ method: 'POST' }))
    },
    body: JSON.stringify({
      params: requestParams,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const json = await response.json();

  // Proxy wraps response in { data: ... }
  return json?.data ?? json;
}
