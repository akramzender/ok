import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Search, UploadIcon, Video } from "lucide-react";
import React from "react";

type Props =  {
  workspaceId: string;
};

const InfoBar = ({ workspaceId }: Props) => {
  return (
    <header className="pl-20 md:pl-[265px] fixed top-0 left-0 p-4 w-full flex items-center justify-between bg-gradient-to-r from-[#131313] to-[#1a1a1a] shadow-lg">
    {/* Search Bar */}
    <div className="flex items-center gap-3 w-full max-w-lg bg-[#1d1d1d] border border-[#3c3c3c] rounded-full px-4 py-2 transition-all ">
      <Search size={20} className="text-[#707070]" />
      <Input
        className="bg-transparent text-sm placeholder-neutral-500 text-white border-none focus:outline-none focus:ring-0 w-full"
        placeholder="Search for people, projects, tags & folders"
      />
    </div>
    

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Upload Button */}
        <Button className=" cursor-pointer bg-white text-black hover:bg-[#00a87e] flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 shadow">
          <UploadIcon size={18} className="text-black" />
          <span>Upload</span>
        </Button>

        {/* Record Button */}
        <Button className=" cursor-pointer bg-white text-black hover:bg-[#00a87e] flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 shadow">
          <Video size={18} className="text-black" />
          <span>Record</span>
        </Button>

        {/* User Profile */}
        <UserButton />
      </div>
    </header>
  );
};

export default InfoBar;