import React from "react";
import { getAllUserVideos, getFolderInfo, getPreviewVideo } from "@/actions/workspace";
import FolderInfo from "@/components/global/folders/folder-info";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Videos from "@/components/global/videos";
import VideoCard from "@/components/global/videos/video-card";


type Props = {
    params:{
        folderId : string
        workspaceId : string
        }
    }

const Page = async({params : {folderId , workspaceId}}:Props)=> {
    const query = new QueryClient()
    await query.prefetchQuery({
        queryKey : ['folder-videos'],
        queryFn : () => getAllUserVideos(folderId)
    })

    await query.prefetchQuery({
        queryKey : ['folder-info'],
        queryFn : () => getFolderInfo(folderId)
    })
   
    return (<HydrationBoundary state={dehydrate(query)}>
        <FolderInfo folderId={folderId} />
        <Videos workspaceId={workspaceId} folderId={folderId} videosKey="folder-videos" />
        
    </HydrationBoundary>)
}
export default Page