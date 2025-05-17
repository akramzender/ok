'use client';
import { getFolderInfo } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { FolderProps } from "@/types/index.type";

type Props = { folderId: string };

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId));
  const { data: folder } = data as FolderProps;

  return (
    <div className="flex items-center gap-4 bg-[#1d1d1d] p-4 rounded-lg shadow-md">
      <h2 className="text-[#f1f8f6] text-xl font-semibold">{folder.name}</h2>
    </div>
  );
};

export default FolderInfo;