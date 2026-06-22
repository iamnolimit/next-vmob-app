import { type UserProfile } from './auth';

const API_GATEWAY = process.env.NEXT_PUBLIC_BASE_URL_API_GATEWAY;
const middlewareEndpoint = API_GATEWAY ? `${API_GATEWAY}api/gateway` : '/api/proxy';

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

  const response = await fetch(middlewareEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': encodeURIComponent(endpoint),
      'Target-Version': encodeURIComponent(apiVersion),
      'Target-Options': encodeURIComponent(JSON.stringify({ method: 'POST' })),
    },
    body: JSON.stringify({ params: requestParams }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const json = await response.json();

  // Gateway/proxy wraps response in { data: ... }
  return json?.data ?? json;
}
