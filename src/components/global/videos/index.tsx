'use client'
import { getAllUserVideos } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { cn } from "@/lib/utils";
import { VideosProps } from "@/types/index.type";
import { VideoIcon } from "lucide-react";
import React from "react";
import VideoCard from "./video-card";


type Props = {
    folderId : string
    videosKey : string
    workspaceId: string
}


const Videos = ({folderId,videosKey,workspaceId}:Props)=> {
    const {data : videoData } = useQueryData([videosKey],()=> getAllUserVideos(folderId))
    const {status : videosStatus , data :videos} = videoData as VideosProps
    
    return (
        <div className=" flex flex-col  gap-4 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <VideoIcon size={25} color="grey"/>
                    <h2 className="text-[#bdbdbd] text-xl">Videos</h2>
                </div>
            </div>
            <section className={cn(videosStatus !== 200 ? 'p-5' :'grid grid-col-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4 2xl:grid-cols-5')}>
                {videosStatus === 200  ? videos.map((video)=><VideoCard key={video.id} workspaceId={workspaceId} {...video}/>)
                 : <p className="text-[#bdbdbd]">No Videos in workspace</p>}
                 
            </section>
        </div>
    )
}

export default Videos