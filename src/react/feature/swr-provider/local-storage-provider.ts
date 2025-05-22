import type { Cache } from 'swr';

export const localStorageProvider = <T>(): Cache<T> => {
  // When initializing, we restore the data from `localStorage` into a map.
  if (typeof window === 'undefined') {
    return new Map([]);
  } else {
    const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'));
    window.addEventListener('beforeunload', () => {
      const appCache = JSON.stringify([...map.entries()]);
      localStorage.setItem('app-cache', appCache);
    });
    return map as Cache<T>;
  }
};
