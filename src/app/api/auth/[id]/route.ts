import { client } from "@/lib/prisma"
import { clerkClient } from "@clerk/clerk-sdk-node"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
  ) {
  console.log("Endpoint hit with Clerk ID:", id)

  if (!id) {
    return NextResponse.json({ status: 400, error: "Missing Clerk ID" })
  }

  try {
    const userProfile = await client.user.findUnique({
      where: { clerkid: id },
      include: {
        studio: true,
        subscription: {
          select: { plan: true },
        },
      },
    })

    if (userProfile) {
      return NextResponse.json({ status: 200, user: userProfile })
    }

    // ❗ FIXED: Removed () from clerkClient
    const clerkUser = await clerkClient.users.getUser(id)

    const createUser = await client.user.create({
      data: {
        clerkid: id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstname: clerkUser.firstName,
        lastname: clerkUser.lastName,
        studio: { create: {} },
        workspace: {
          create: {
            name: `${clerkUser.firstName || "User"}'s Workspace`,
            type: "PERSONAL",
          },
        },
        subscription: { create: {} },
      },
      include: {
        subscription: {
          select: { plan: true },
        },
      },
    })

    return NextResponse.json({ status: 201, user: createUser })
  } catch (error) {
    console.error("ERROR", error)
    return NextResponse.json({ status: 500, error: "Internal Server Error" })
  }
}
