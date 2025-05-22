'use client';
import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';
import { localStorageProvider } from './local-storage-provider';

const fetcher = (url: string | URL | Request) =>
  fetch(url, {
    credentials: 'include'
  }).then((res) => res.json());

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 2000,
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        revalidateOnReconnect: true,
        provider: localStorageProvider
      }}
    >
      {children}
    </SWRConfig>
  );
}
