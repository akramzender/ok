import React from "react";
import { useSearch } from "@/hooks/useSearch";
import { useMutationData } from "@/hooks/useMutationData";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback ,AvatarImage} from "@/components/ui/avatar";

import {  User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../loader";
import { inviteMembers } from "@/actions/user";



type Props ={
    workspaceId:string
}

const Search = ({workspaceId}:Props) =>{
   const {query,onSearchQuery,isFetching,onUsers}=useSearch(
        'get-users',
        'USERS'
   )
   //WIP : wire up sending invitation
const {mutate,isPending}= useMutationData(
    ['invite-member'],
(data:{receiverId:string; email:string})=> inviteMembers(workspaceId,data.receiverId,data.email)

)

    return (<div className="flex flex-col gap-y-5">
        <Input 
  onChange={onSearchQuery} 
  value={query} 
  placeholder="Search for user..."
  type="text"
  className="bg-[#1e1e1e] border border-neutral-700 focus-visible:ring-2 focus-visible:ring-[#00a87e] rounded-md p-2 text-white"
/>

        
        {isFetching ? <div className="flex flex-col gap-y-2">
            <Skeleton className="w-full h-8 rounded-xl"/>
             </div> : !onUsers ? (
                    <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
             ):(
                <div>{onUsers.map((user)=> (
                    <div key={user.id} 
                className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl">
                    <Avatar>
                        <AvatarImage src={user.image as string}/>
                            <AvatarFallback>
                                <User/>
                            </AvatarFallback>

                    </Avatar>
                    <div className="flex flex-col items-start">
                        <h3 className="text-bold text-lg capitalize">{user.firstname} {user.lastname}</h3>
                        <p className="lowercase text-xs bg-[#00a87e] px-2 rounded-lg   text-[#1e1e1e]">
                            {user.subscription?.plan}
                        </p>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                    <Button 
  onClick={() => mutate(
    { receiverId: user.id, email: user.email },
    {
      onSuccess: () => {
        console.log("User invited successfully! 🎉");
        // TODO: show a success toast or clear input or close modal
      },
      onError: (error) => {
        console.error("Failed to invite:", error);
        // TODO: show an error toast
      },
    }
  )} 
  variant="default"
  className="w-5/12 font-bold bg-white hover:bg-[#b9b9b9] cursor-pointer text-black transition-all"
>
  <Loader state={isPending} color="#000" className="text-black">Invite</Loader>
</Button>

                    </div>
                </div>
                ))}
                </div> 
                
             )
                
                }
             
    </div>
)}
export default Search