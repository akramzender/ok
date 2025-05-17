'use client';

import { Button } from "@/components/ui/button";
import { useCreateFolders } from "@/hooks/useCreateFolders";
import { FolderPlusIcon } from "lucide-react";
import React from "react";

type Props = { workspaceId: string };

const CreateFolders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId);

  return (
    <Button
      onClick={onCreateNewFolder}
      className="bg-[#1d1d1d] text-[#f1f8f6] flex items-center gap-2 py-3 px-5 rounded-xl hover:bg-[#2e2e2e] hover:text-[#00a87e] transition-all shadow-md"
    >
      <FolderPlusIcon className="w-5 h-5" />
      <span className="text-sm font-semibold">Create a Folder</span>
    </Button>
  );
};

export default CreateFolders;