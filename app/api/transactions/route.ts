import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  console.log("Attempting to get server session...");
  const session = await getServerSession(authOptions);
  console.log("Server session:", session);

  if (!session) {
    console.log("No session found, returning 401");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch transactions for the authenticated user
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      date: 'desc'
    }
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  
  // Create a new transaction for the authenticated user
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId: session.user.id
    }
  });

  return NextResponse.json(transaction, { status: 201 });
}