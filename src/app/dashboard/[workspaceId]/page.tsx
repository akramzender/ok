'use client';
import React from "react";
import CreateFolders from "@/components/global/create-folders";
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Videos from "@/components/global/videos";
import VideoCard from "@/components/global/videos/video-card";

type ParamsType = {
    workspaceId: string
};

type Props = {
    params: ParamsType | Promise<ParamsType>
};

const Page = ({ params }: Props) => {
    // Type the resolved params correctly
    const resolvedParams = React.use(params as Promise<ParamsType>) as ParamsType;
    const workspaceId = resolvedParams.workspaceId;
    
    return (
        <div>
            <Tabs defaultValue="videos" className="mt-6">
                <div className="flex w-full justify-between items-center">
                    <TabsList className="bg-transparent gap-2 pl-0">
                        <TabsTrigger 
                            className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] cursor-pointer hover:data-[state=active]:bg-[#464545]"
                            value="videos"
                        >
                            Videos
                        </TabsTrigger>
                        <TabsTrigger 
                            className="data-[state=active]:bg-[#252525] p-[13px] px-6 rounded-full cursor-pointer hover:bg-[#252525]" 
                            value="archive"
                        >
                            Archive
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-x-3">
                        <CreateWorkspace />
                        <CreateFolders workspaceId={workspaceId} />
                    </div>
                </div>
                <section className="py-9">
                    {/* Videos Tab */}
                    <TabsContent value="videos">
                        <Folders workspaceId={workspaceId} />
                        {/* Include the Videos component */}
                        
                    </TabsContent>

                    {/* Archive Tab */}
                    <TabsContent value="archive">
                        <p className="text-[#bdbdbd]">This is the archive tab content.</p>
                    </TabsContent>
                </section>
            </Tabs>
        </div>
    );
};

export default Page;