'use client';
import { App } from 'konsta/react';

export default function KonstaApp({ children }: { children: React.ReactNode }) {
  return (
    <App theme="ios" className="h-full">
      {children}
    </App>
  );
}
