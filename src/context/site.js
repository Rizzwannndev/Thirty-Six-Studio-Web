import { createContext, useContext } from 'react';

export const SiteContext = createContext(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error('useSite must be used inside <SiteProvider>');
  return value;
}
