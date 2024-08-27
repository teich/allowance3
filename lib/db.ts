import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const MOCK_USER_ID = 'mock-user-123';

export async function ensureMockUserExists() {
  const user = await prisma.user.upsert({
    where: { id: MOCK_USER_ID },
    update: {},
    create: {
      id: MOCK_USER_ID,
      email: 'mock@example.com',
      name: 'Mock User',
    },
  });
  return user;
}

export { prisma };