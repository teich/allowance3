import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allowances = await prisma.allowance.findMany({
      where: { user: { email: session.user.email } },
    });

    return NextResponse.json(allowances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch allowances' }, { status: 500 });
  }
}