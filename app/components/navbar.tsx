'use client';  // Add this line at the top of the file

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Allowance Tracker</Link>
        <div>
          {session ? (
            <>
              <Link href="/dashboard" className="mr-4">Dashboard</Link>
              <Link href="/api/auth/signout">Sign Out</Link>
            </>
          ) : (
            <Link href="/api/auth/signin">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}