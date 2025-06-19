'use client';

import type React from 'react';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') {
      if (status === 'authenticated') router.push('/admin');
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return pathname === '/admin/login' || status === 'authenticated' ? (
    <div className="min-h-screen bg-gray-50">{children}</div>
  ) : null;
}
