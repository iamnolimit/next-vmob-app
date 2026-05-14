'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface NavLoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
}

const NavLoadingContext = createContext<NavLoadingContextType>({
  isLoading: false,
  startLoading: () => {},
});

export function NavLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, '') || '/';
  const prevPathname = useRef(normalizedPathname);

  // Auto-stop when pathname changes (navigation complete)
  useEffect(() => {
    if (normalizedPathname !== prevPathname.current) {
      prevPathname.current = normalizedPathname;
      setIsLoading(false);
    }
  }, [normalizedPathname]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <NavLoadingContext.Provider value={{ isLoading, startLoading }}>
      {children}
    </NavLoadingContext.Provider>
  );
}

export function useNavLoading() {
  return useContext(NavLoadingContext);
}
