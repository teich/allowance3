import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();

  try {
    const family = await prisma.family.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.id,
            role: 'admin',
          },
        },
      },
    });
    return NextResponse.json(family);
  } catch (error) {
    console.error("Error creating family:", error);
    return NextResponse.json({ error: "Failed to create family" }, { status: 500 });
  }
}