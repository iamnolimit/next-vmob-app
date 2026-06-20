'use client';

import dayjs from 'dayjs';

export interface UserProfile {
  id: string;
  app_id: string;
  app_reg: string;
  user_id: string;
  nama: string;
  username: string;
  email: string;
  jabatan: string;
  cabang: string;
  avatar: string;
  group: string;
  domain: string;
  gr_id: string | number;
  status: string | number;
  app_jenis?: string | number;
  token?: string;
  dokid?: string;
  kl_id?: string;
}

const KEY = 'vmob_user';
const SESSIONS_KEY = 'vmob_sessions';

export function saveUser(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(profile));
    
    // Update sessions list
    const sessions = getSessions();
    const existingIndex = sessions.findIndex(s => s.username === profile.username && s.domain === profile.domain);
    if (existingIndex >= 0) {
      sessions[existingIndex] = profile;
    } else {
      sessions.push(profile);
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
}

export function getSessions(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function switchSession(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(profile));
  }
}

export function removeSession(username: string, domain: string) {
  if (typeof window !== 'undefined') {
    let sessions = getSessions();
    sessions = sessions.filter(s => !(s.username === username && s.domain === domain));
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    
    const currentUser = getUser();
    if (currentUser && currentUser.username === username && currentUser.domain === domain) {
      if (sessions.length > 0) {
        switchSession(sessions[0]);
      } else {
        clearUser();
      }
    }
  }
}

export function getUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SESSIONS_KEY);
  }
}

async function callProxy(endpoint: string, params: Record<string, unknown>, apiVersion = 'api7') {
  // Use absolute URL in Capacitor, relative in browser
  const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost') 
    ? '' 
    : 'https://next-vmob-app.vercel.app';
    
  const response = await fetch(`${baseUrl}/api/proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, apiVersion, params }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `Request failed: ${response.status}`);
  }
  const json = await response.json();
  return json?.data ?? json;
}

export async function login(
  domain: string,
  username: string,
  password: string
): Promise<UserProfile | null> {
  const resLogin = await callProxy('sys/login-v2', {
    u: username,
    p: password,
    t: domain,
    device: 'mobile',
    ip: '',
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });

  if (!resLogin || resLogin?.status === 'error') {
    throw new Error(resLogin?.message || 'Login gagal');
  }

  const dataUser = resLogin?.data ?? resLogin;

  if (dataUser?.status === 11 || dataUser?.status === '11') {
    throw new Error('Akun Anda telah dinonaktifkan.');
  }

  const token = btoa(unescape(encodeURIComponent(`${dataUser?.id}--SED--${dayjs().unix()}`)));

  // Register token on server
  await callProxy('penjualan-obat-v3/set-token', {
    a: dataUser?.app_id,
    reg: dataUser?.app_reg,
    uid: dataUser?.id,
    token,
    expired: dayjs().add(4, 'hour').unix(),
  });

  const profile: UserProfile = {
    id: String(dataUser?.id ?? ''),
    app_id: String(dataUser?.app_id ?? ''),
    app_reg: String(dataUser?.app_reg ?? ''),
    user_id: String(dataUser?.id ?? ''),
    nama: dataUser?.nama_lengkap ?? dataUser?.nama ?? dataUser?.name ?? username,
    username: dataUser?.username ?? username,
    email: dataUser?.email ?? '',
    jabatan: dataUser?.jabatan ?? '',
    cabang: dataUser?.kl_nama ?? dataUser?.nama_apotek ?? dataUser?.cabang ?? '',
    avatar: dataUser?.kl_logo ? `https://apt.vmedis.com/foto/${dataUser.kl_logo}` : (dataUser?.nama_lengkap ?? dataUser?.nama ?? username).substring(0, 2).toUpperCase(),
    group: String(dataUser?.gr_id ?? ''),
    domain,
    gr_id: dataUser?.gr_id ?? '',
    status: dataUser?.status ?? '',
    app_jenis: dataUser?.app_jenis ?? '',
    token,
    dokid: dataUser?.dokid ?? '',
    kl_id: dataUser?.kl_id ?? '',
  };

  saveUser(profile);
  return profile;
}
