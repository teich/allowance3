import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

const MOCK_USER_ID = "test-user-id-123"; // Update this to match the seed.ts file

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, type, amount, description } = body;

    let userId;

    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      userId = MOCK_USER_ID;
    } else {
      const session = await getServerSession(null);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.id;
    }

    const transaction = await prisma.transaction.create({
      data: {
        category,
        type,
        amount,
        description,
        userId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    let userId;

    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      userId = MOCK_USER_ID;
    } else {
      const session = await getServerSession(null);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.id;
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}