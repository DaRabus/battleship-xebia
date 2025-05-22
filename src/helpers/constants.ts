export const __IS_CLIENT = typeof window !== 'undefined';
export const __IS_SERVER = !__IS_CLIENT;

export const ERROR_LOGGING_PATTERN = (version: string, route: string) => {
  return `${version} || ${route} ROUTE ||`;
};

export enum SWR_CACHE_KEYS {
  USER = 'USER',
}

