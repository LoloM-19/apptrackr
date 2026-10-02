import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const body = await request.json()
    const { company, position, status, location, salary, url, notes } = body

    if (!company || !position) {
      return NextResponse.json(
        { error: "Company and position are required" },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        company,
        position,
        status: status || "APPLIED",
        location,
        salary,
        url,
        notes,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}