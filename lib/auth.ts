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

export function saveUser(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(profile));
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
  }
}

async function callProxy(endpoint: string, params: Record<string, unknown>, apiVersion = 'api7') {
  const response = await fetch('/api/proxy', {
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
    nama: dataUser?.nama ?? dataUser?.name ?? username,
    username: dataUser?.username ?? username,
    email: dataUser?.email ?? '',
    jabatan: dataUser?.jabatan ?? '',
    cabang: dataUser?.nama_apotek ?? dataUser?.cabang ?? '',
    avatar: (dataUser?.nama ?? username).substring(0, 2).toUpperCase(),
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
