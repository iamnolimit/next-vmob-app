import { type UserProfile } from './auth';

export async function fetchApi(
  endpoint: string,
  params: Record<string, unknown>,
  user: UserProfile | null,
  apiVersion: string = 'api7'
) {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const requestParams = {
    ...params,
    a: user.app_id,
    reg: user.app_reg,
  };

  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      apiVersion,
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
