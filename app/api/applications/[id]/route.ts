import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params
    const application = await prisma.application.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const application = await prisma.application.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        company: body.company,
        position: body.position,
        status: body.status,
        location: body.location,
        salary: body.salary,
        url: body.url,
        notes: body.notes,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    const { id } = await params

    const application = await prisma.application.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.application.delete({ where: { id } })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}