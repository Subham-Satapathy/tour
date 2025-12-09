'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo.png" alt="Triveni Tours Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              href="/admin"
              className={`hover:text-blue-300 transition ${
                isActive('/admin') ? 'text-blue-300 font-semibold' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/vehicles"
              className={`hover:text-blue-300 transition ${
                isActive('/admin/vehicles') || pathname?.startsWith('/admin/vehicles/')
                  ? 'text-blue-300 font-semibold'
                  : ''
              }`}
            >
              Vehicles
            </Link>
            <Link
              href="/admin/bookings"
              className={`hover:text-blue-300 transition ${
                isActive('/admin/bookings') ? 'text-blue-300 font-semibold' : ''
              }`}
            >
              Bookings
            </Link>
            <Link href="/" className="hover:text-blue-300 transition">
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
