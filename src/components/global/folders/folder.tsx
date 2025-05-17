'use client';
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Loader from "../loader";
import { FolderIcon } from "lucide-react";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { renameFolders } from "@/actions/workspace";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  id: string;
  optimistic?: boolean;
  count?: number;
};

const Folder = ({ name, id, optimistic, count }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const folderCardRef = useRef<HTMLDivElement | null>(null);
  const pathName = usePathname();
  const router = useRouter();
  const [onRename, setOnRename] = useState(false);

  const Rename = () => setOnRename(true);
  const Renamed = () => setOnRename(false);

  const { mutate, isPending } = useMutationData(
    ['rename-folders'],
    (data: { name: string }) => renameFolders(id, data.name),
    'workspace-folders',
    Renamed
  );
  const { latestVariables } = useMutationDataState(['rename-folders']);

  const handleFolderClick = () => {
    if (onRename) return;
    router.push(`${pathName}/folder/${id}`);
  };

  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    Rename(); // Start renaming
  };

  const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputRef.current && inputRef.current.value) {
      mutate({ name: inputRef.current.value, id });
    } else {
      Renamed();
    }
  };

  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        optimistic && 'opacity-60',
        'flex hover:bg-[#2e2e2e] cursor-pointer transition-all duration-150 items-center gap-4 justify-between min-w-[250px] py-4 px-5 rounded-lg border-[1px] border-[#3c3c3c] bg-[#1d1d1d] shadow-md'
      )}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap-1">
          {onRename ? (
            <Input
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                updateFolderName(e);
              }}
              autoFocus
              placeholder={name}
              className="border-none underline text-base w-full outline-none text-neutral-300 bg-transparent p-0"
              ref={inputRef}
            />
          ) : (
            <p
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from triggering parent click handlers
              }}
              className="text-neutral-300 font-medium truncate"
              onDoubleClick={handleNameDoubleClick} // Handle double-click for renaming
            >
              {latestVariables &&
              latestVariables.status === 'pending' &&
              latestVariables.variables.id === id
                ? latestVariables.variables.name
                : name}
            </p>
          )}
          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderIcon className="text-neutral-400 group-hover:text-[#00a87e] transition-transform duration-300" />
    </div>
  );
};

export default Folder;