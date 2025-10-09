'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { SearchProvider } from '@/lib/contexts/search-context';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SearchProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Header />
          {children}
        </main>
      </div>
    </SearchProvider>
  );
}
