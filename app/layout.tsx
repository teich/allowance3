'use client';

import './globals.css'
import { SessionProvider } from "next-auth/react"
import Navbar from './components/navbar'
import { ReactNode, useEffect } from "react";

// const MockSessionProvider = ({ children }: { children: ReactNode }) => {
//   const mockSession = {
//     user: { id: "test-user-id-123", name: "Test User", email: "test@example.com" },
//     expires: "9999-12-31T23:59:59.999Z"
//   };

//   useEffect(() => {
//     console.log("Using MockSessionProvider with session:", mockSession);
//   }, []);

//   return (
//     <SessionProvider session={mockSession}>
//       {children}
//     </SessionProvider>
//   );
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const Provider = SessionProvider;

  return (
    <html lang="en">
      <body>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  )
}