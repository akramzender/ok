import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/useFolders";
import { SeparatorHorizontal } from "lucide-react";

import React from "react";

type Props = {
    videoId : string
    currentFolder? : string
    currentworkspace? : string
}
const ChangeVideoLocation = ({videoId,currentFolder,currentworkspace}:Props)=> {
const {onFormSubmit,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders} = useMoveVideos(videoId,currentworkspace!)
const folder = folders.folders.find((f)=> f.id === currentFolder)
const workspace = workspaces.workspaces.find((f)=> f.id === currentworkspace)


    return (
        <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
                <div className="border-[1px] rounded-xl p-5">
                    <h2 className="text-xs mb-5 text-[#a4a4a4]">Current Workspace</h2>
                    {workspace &&<p className="text-[#a4a4a4]">{workspace.name} Workspace</p>}
                    
                    <h2 className=" text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
                    {folder ? <p>{folder.name}</p> : 'This video has no folder '}

                    

                </div>
        <SeparatorHorizontal />
        <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl  text-gray-900 dark:text-white">
            <h2 className=" text-xs text-[#a4a4a4]">To</h2>
            <Label className="flex-col gap-y-2 flex">
                <p className="text-xs">Workspace</p>
                <select {...register('workspace_id')}className=" rounded-xl  text-base bg-gray-50 border border-gray-300 text-gray-900  focus:ring-black focus:border-b-black block w-full p-2.5 dark:bg-black dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black">
                {workspaces.workspaces.map((space)=>(
                    <option  key={space.id} className="text-[#a4a4a4]" value={space.id} >{space.name}</option>
                ))}
                    
                </select>
            </Label>
            {isFetching ? (
                <Skeleton  className=" w-full h-[40px] rounded-xl"/>
            ):(
                <Label className="flex flex-col gap-y-2 font-medium text-gray-900 dark:text-white">
                    <p className="text-xs">Folders in this workspace</p>
                    {isFolders && isFolders.length > 0 ? (
                    <select {...register('folder_id')}
                     className="rounded-xl  text-base bg-gray-50 border border-gray-300 text-gray-900  focus:ring-black focus:border-b-black block w-full p-2.5 dark:bg-black dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                     >
                        {isFolders.map((folder , key)=> 
                        key === 0 ? (
                            <option className="text-[#a4a4a4] bg-[#000000 ]"
                                    key={folder.id}
                                    value={folder.id}
                                    >
                                        {folder.name}
                                    </option>
                        ): (
                        <option 
                            className="text-[#a4a4a4] bg-[#000000]"
                            key={folder.id}
                            value={folder.id}
                            >
                                {folder.name}
                            </option>
                            )
                        )}
                    </select> )  : (
                        <p className="text-[#a4a4a4] text-sm">This worksapce has no folders</p>
                    )}
                </Label>
            )}
        </div>
        <Button className="bg-white text-black cursor-pointer hover:bg-[#acabab]">
            <Loader state={isPending}  color="#000">Transfer</Loader>
        </Button>
    </form>
    )
}

export default ChangeVideoLocation