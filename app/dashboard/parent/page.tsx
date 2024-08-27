import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function ParentDashboard() {
  const session = await getServerSession()

  if (!session || session.user.role !== "parent") {
    redirect("/")
  }

  const family = await prisma.family.findFirst({
    where: { members: { some: { userId: session.user.id } } },
    include: { members: { include: { user: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
      <h2 className="text-xl mb-2">Family: {family?.name}</h2>
      <ul>
        {family?.members.map((member) => (
          <li key={member.id}>{member.user.name} - {member.role}</li>
        ))}
      </ul>
      {/* Add more dashboard content here */}
    </div>
  )
}