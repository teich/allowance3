import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({
    where: { id: 'test-user-id-123' },
    update: {},
    create: {
      id: 'test-user-id-123',
      name: 'Test User',
      email: 'test@example.com',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
