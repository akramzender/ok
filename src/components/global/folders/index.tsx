'use client';
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, FolderIcon } from "lucide-react";

import Folder from "./folder";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/useMutationData";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folders";

type Props = {
  workspaceId: string;
};

export type FoldersProps = {
  status: number;
  data: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workspaceId: string | null;
  })[];
};

const Folders = ({ workspaceId }: Props) => {
  const { data, isFetched } = useQueryData(
    ["workspace-folders"],
    () => getWorkspaceFolders(workspaceId)
  );
  const dispatch = useDispatch();
  const { latestVariables } = useMutationDataState(["create-folder"]);

  const { status, data: folders } = data as FoldersProps;

  // Dispatch fetched folders to Redux
  if (isFetched && folders) {
    dispatch(FOLDERS({ folders: folders }));
  }

  return (
    <div className="flex flex-col gap-6 bg-[#1d1d1d] p-6 rounded-xl shadow-md">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderIcon className="text-[#00a87e] w-5 h-5" />
          <h2 className="text-white text-lg font-semibold">Folders</h2>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <p className="text-[#bdbdbd] group-hover:text-[#00a87e] transition">
            More
          </p>
          <ArrowRight
            className="group-hover:translate-x-1 transition-transform duration-200"
            color="#707070"
          />
        </div>
      </div>

      {/* Folders Section */}
      <section
        className={cn(
          status !== 200 && "justify-center",
          "flex items-center gap-4 overflow-x-auto w-full"
        )}
      >
        {status !== 200 ? (
          <p className="text-neutral-300">No Folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables}
                optimistic
              />
            )}
            {folders.map((folder) => (
              <Folder
                name={folder.name}
                count={folder._count.videos}
                id={folder.id}
                key={folder.id}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default Folders;