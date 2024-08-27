'use client';  // Add this line at the top of the file

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  
  console.log("Current session:", session);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Allowance Tracker</Link>
        <div>
          <Link href="/dashboard" className="mr-4">Dashboard</Link>
          {session ? (
            <>
              <button onClick={() => signOut()} className="mr-4">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/register" className="mr-4">Register</Link>
              <Link href="/login">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}