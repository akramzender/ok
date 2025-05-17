'use client'
import { getWorkspaces } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { useQueryData } from "@/hooks/useQueryData";
import { FolderPlusIcon } from "lucide-react";
import React from "react";
import Modal from "../modal";
import WorkspaceForm from "@/components/forms/workspace-form";

type Props = {};

const CreateWorkspace = (props: Props) => {
  const { data } = useQueryData(["user-workspaces"], getWorkspaces);
  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "FREE" | "PRO";
      } | null;
    };
  };


  // Return nothing if the user is on the FREE plan
  if (plan.subscription?.plan === "FREE") {
    return <></>;
  }

  // Render modal and button for the PRO plan
  if (plan.subscription?.plan === "PRO") {
    return (
      <div className="flex justify-center items-center">
        <Modal
          title="Create a Workspace"
          description="Workspaces help you collaborate with team members. You are assigned a default personal workspace where you can privately share videos with yourself."
          trigger={
            <Button className="bg-[#1d1d1d] text-[#f1f8f6] flex items-center gap-2 py-4 px-6 rounded-xl hover:bg-[#2e2e2e] hover:text-[#00a87e] transition-all shadow-md">
              <FolderPlusIcon className="text-[#00a87e]" />
              <span className="text-sm font-semibold">Create Workspace</span>
            </Button>
          }
        >
          <WorkspaceForm />
        </Modal>
      </div>
    );
  }

  return null;
};

export default CreateWorkspace;