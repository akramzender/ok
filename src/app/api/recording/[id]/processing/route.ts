import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ✅ Extract dynamic segment from the URL path
        const urlParts = req.nextUrl.pathname.split("/");
        const id = urlParts[urlParts.length - 2]; // 'userId' from /api/recording/[id]/processing

        if (!id) {
            return NextResponse.json({ status: 400, message: "Missing required parameter: id" });
        }

        if (!body.filename) {
            return NextResponse.json({ status: 400, message: "Missing required field: filename" });
        }

        // 🔄 Remaining logic stays the same
        const personalWorkspace = await client.user.findUnique({
            where: { id },
            select: {
                workspace: {
                    where: { type: "PERSONAL" },
                    select: { id: true },
                },
            },
        });

        if (!personalWorkspace?.workspace[0]?.id) {
            return NextResponse.json({ status: 404, message: "Personal workspace not found" });
        }

        const workspaceId = personalWorkspace.workspace[0].id;

        let folderId;
        try {
            const existingFolder = await client.folder.findFirst({ where: { workSpaceId: workspaceId } });
            folderId = existingFolder ? existingFolder.id : (
                await client.folder.create({
                    data: {
                        name: "Default Folder",
                        WorkSpace: { connect: { id: workspaceId } },
                    },
                })
            ).id;
        } catch (error) {
            return NextResponse.json({ status: 500, message: "Error creating or finding folder" });
        }

        try {
            // If the filename is a URL, handle it properly
            let source = body.filename;
            
            // Check if our source might be a URL from S3 
            if (body.filename.startsWith('http') && (body.filename.includes('s3.') || body.filename.includes('amazonaws.com'))) {
                console.log("Detected S3 URL as source:", body.filename);
                source = body.filename; // Use the full URL as source
            }
            
            const videoRecord = await client.video.create({
                data: {
                    source: source,
                    userId: id,
                    folderId: folderId,
                    workSpaceId: workspaceId,
                    processing: true,
                },
            });

            const userPlan = await client.user.findUnique({
                where: { id },
                select: { subscription: { select: { plan: true } } },
            });

            return NextResponse.json({ status: 200, plan: userPlan?.subscription?.plan || "FREE" });
        } catch (error) {
            return NextResponse.json({ status: 500, message: "Error creating video record" });
        }

    } catch (error) {
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
}
