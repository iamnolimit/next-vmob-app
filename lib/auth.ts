'use client';

export interface UserProfile {
  id: string;
  nama: string;
  username: string;
  email: string;
  jabatan: string;
  cabang: string;
  avatar: string; // initials
  group: string;
}

export const DUMMY_USERS: { username: string; password: string; profile: UserProfile }[] = [
  {
    username: 'admin',
    password: 'admin123',
    profile: {
      id: 'USR-001',
      nama: 'Administrator',
      username: 'admin',
      email: 'admin@vmedis.com',
      jabatan: 'Administrator Sistem',
      cabang: 'Klinik Sehat Sentosa',
      avatar: 'AD',
      group: 'Admin',
    },
  },
  {
    username: 'dokter',
    password: 'dokter123',
    profile: {
      id: 'USR-002',
      nama: 'dr. Budi Santoso',
      username: 'dokter',
      email: 'budi.santoso@vmedis.com',
      jabatan: 'Dokter Umum',
      cabang: 'Klinik Sehat Sentosa',
      avatar: 'BS',
      group: 'Dokter',
    },
  },
  {
    username: 'kasir',
    password: 'kasir123',
    profile: {
      id: 'USR-003',
      nama: 'Ani Susanti',
      username: 'kasir',
      email: 'ani.susanti@vmedis.com',
      jabatan: 'Kasir',
      cabang: 'Klinik Sehat Sentosa',
      avatar: 'AS',
      group: 'Kasir',
    },
  },
];

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

export function login(username: string, password: string): UserProfile | null {
  const found = DUMMY_USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (found) {
    saveUser(found.profile);
    return found.profile;
  }
  return null;
}
