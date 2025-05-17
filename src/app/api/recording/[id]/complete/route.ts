import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const body = await req.json();
    const id  = (await params).id;
    
    const completeProcessing = await  client.video.update({
        where : {
            userId : id,
            source : body.filename
        },
        data : {
            processing : false
        }

    })
    if(completeProcessing){
        return NextResponse.json({
            status : 200,
            message : 'Video processing completed'
        })
    }
    return NextResponse.json({
        status : 400,
        message : 'Video processing failed'
    })
}