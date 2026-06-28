'use client';

import dayjs from 'dayjs';

import qs from 'qs';

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
  lvl?: number;
  aksesMenu?: string[];
  logo?: string;
  apt_logo?: string;
  kl_logo?: string;
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

const API_GATEWAY = process.env.NEXT_PUBLIC_BASE_URL_API_GATEWAY;
const middlewareEndpoint = API_GATEWAY ? `${API_GATEWAY}api/gateway` : '/api/proxy';

async function callProxy(endpoint: string, params: Record<string, unknown>, apiVersion = 'api7') {
  const response = await fetch(middlewareEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': encodeURIComponent(endpoint),
      'Target-Version': encodeURIComponent(apiVersion),
      'Target-Options': encodeURIComponent(JSON.stringify({ method: 'POST' })),
    },
    body: JSON.stringify({ params }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || `Request failed: ${response.status}`);
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

  const lvl = Number(dataUser?.lvl ?? 999);
  const grId = dataUser?.gr_id ?? '';
  const appJenis = Number(dataUser?.app_jenis ?? 0);
  const appReg = String(dataUser?.app_reg ?? '');
  const appId = String(dataUser?.app_id ?? '');

  // Fetch menu access (same logic as iOS LoginService.fetchMenuAccess)
  let aksesMenu: string[] = [];
  if (lvl !== 1) {
    try {
      aksesMenu = await fetchMenuAccess({
        grId: Number(grId),
        appId,
        appJenis,
        appReg,
        token,
      });
    } catch {
      // fallback: no restriction
    }
  }

  // Construct avatar URL based on iOS logic
  let avatarUrl = '';
  const baseImageURL = 'https://apt.vmedis.com/foto/';
  
  if (dataUser?.logo && dataUser.logo !== '') {
    avatarUrl = baseImageURL + dataUser.logo;
  } else if (appJenis === 2 && dataUser?.apt_logo && dataUser.apt_logo !== '') {
    avatarUrl = baseImageURL + dataUser.apt_logo;
  } else if (dataUser?.kl_logo && dataUser.kl_logo !== '') {
    avatarUrl = baseImageURL + dataUser.kl_logo;
  }

  const profile: UserProfile = {
    id: String(dataUser?.id ?? ''),
    app_id: appId,
    app_reg: appReg,
    user_id: String(dataUser?.id ?? ''),
    nama: dataUser?.nama_lengkap ?? dataUser?.nama ?? dataUser?.name ?? username,
    username: dataUser?.username ?? username,
    email: dataUser?.email ?? '',
    jabatan: dataUser?.jabatan ?? '',
    cabang: dataUser?.kl_nama ?? dataUser?.nama_apotek ?? dataUser?.cabang ?? '',
    avatar: avatarUrl,
    group: String(grId),
    domain,
    gr_id: grId,
    status: dataUser?.status ?? '',
    app_jenis: appJenis,
    token,
    dokid: dataUser?.dokid ?? '',
    kl_id: dataUser?.kl_id ?? '',
    lvl,
    aksesMenu,
    logo: dataUser?.logo ?? '',
    apt_logo: dataUser?.apt_logo ?? '',
    kl_logo: dataUser?.kl_logo ?? '',
  };

  saveUser(profile);
  return profile;
}

async function fetchMenuAccess({
  grId,
  appId,
  appJenis,
  appReg,
  token,
}: {
  grId: number;
  appId: string;
  appJenis: number;
  appReg: string;
  token: string;
}): Promise<string[]> {
  // Hitung jenis berdasarkan app_jenis (sama seperti iOS)
  let jenis: string;
  if (appJenis === 3) {
    jenis = '1,2,3';
  } else if (appJenis === 2 || appJenis === 1) {
    jenis = `${appJenis},3`;
  } else {
    jenis = `${appJenis}`;
  }

  const response = await fetch(middlewareEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': encodeURIComponent('menu/menu3'),
      'Target-Version': encodeURIComponent('api7'),
      'Target-Options': encodeURIComponent(JSON.stringify({ method: 'POST' })),
    },
    body: JSON.stringify({
      params: {
        a: appId,
        gr_id: grId,
        reg: appReg,
        jenis,
        devices: '1,2',
      },
    }),
  });

  if (!response.ok) return [];

  const json = await response.json();
  const raw = json?.data ?? json;

  const aksesMenu: string[] = [];

  // data1 berisi detail menu dengan mn_url
  const data1 = raw?.data1;
  if (Array.isArray(data1)) {
    for (const item of data1) {
      if (typeof item !== 'object' || !item) continue;
      const mnUrl = item.mn_url;
      const mnAktif = item.mn_aktif;
      if (mnUrl && mnUrl !== '#' && mnAktif === '1') {
        aksesMenu.push(mnUrl);
      }
    }
  }

  return aksesMenu;
}
