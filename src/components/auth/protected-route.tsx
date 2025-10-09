'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push('/login');
    } else if (isAuthenticated && isPublicRoute) {
      // Already authenticated and trying to access login/register
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  // Show loading or nothing while redirecting
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


