import React from "react";
import { getAllUserVideos, getFolderInfo } from "@/actions/workspace";
import FolderInfo from "@/components/global/folders/folder-info";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Videos from "@/components/global/videos";


type Props = {
    params: Promise<{
      folderId: string;
      workspaceId: string;
    }>;
  };
  
  const Page = async ({ params }: Props) => {
    const { folderId, workspaceId } = await params;  // await here
  
    const query = new QueryClient();
    await query.prefetchQuery({
      queryKey: ['folder-videos'],
      queryFn: () => getAllUserVideos(folderId),
    });
  
    await query.prefetchQuery({
      queryKey: ['folder-info'],
      queryFn: () => getFolderInfo(folderId),
    });
  
    return (
      <HydrationBoundary state={dehydrate(query)}>
        <FolderInfo folderId={folderId} />
        <Videos workspaceId={workspaceId} folderId={folderId} videosKey="folder-videos" />
      </HydrationBoundary>
    );
  };
  
  export default Page;
  