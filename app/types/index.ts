import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface Transaction {
  id: string;
  date: string;
  category: 'savings' | 'spending' | 'giving';
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

export interface FamilyMember {
    id: string | null;
    user: { name: string | null };
    role: string;
  }