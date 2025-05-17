'use client';

import React from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaces } from "@/actions/workspace";
import { NotificationsProps, WorkspaceProps } from "@/types/index.type";
import { Loader, Menu, PlusCircle } from "lucide-react";
import { Modal } from "../modal";

import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-item";
import { getNotifications } from "@/actions/user";
import WorkspacePlaceholder from "./workspace-placeholder";
import { Button } from "@/components/ui/button";
import GlobalCard from "../global-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";
import { useDispatch } from "react-redux";
import { WORKSPACES } from "@/redux/slices/workspaces";
import Search from "../search";
import PaymentButton from "../paymentButton";

type Props = {
  activeWorkspaceId: string;
};

export const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();

  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkspaces);
  const menuItems = MENU_ITEMS(activeWorkspaceId);
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const workspace = (data as WorkspaceProps)?.data || null;
  const notificationCount =
    (notifications as NotificationsProps)?.data?._count?.notification || 0;
    

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace?.workspace?.find(
    (s) => s.id === activeWorkspaceId
  );

  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }));
  }

  const SidebarSection = (
    <div className="bg-[#111111] h-screen flex-none relative p-4 w-[250px] flex flex-col gap-4 items-center shadow-lg">
      {/* Logo Section */}
    <div className="flex flex-row items-center gap-2 mt-2">
  <Image src="/odix.svg" alt="logo" width={40} height={40} />
  <p className="text-2xl font-extrabold text-[#f1f8f6]">Odix</p>
</div>

      {/* Workspace Selector */}
      <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
        <SelectTrigger className="mt-8 text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-md shadow-sm focus:ring-2 focus:ring-[#00a87e]">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className="bg-[#1e1e1e] shadow-md rounded-lg">
          <SelectGroup>
            <SelectLabel className="text-gray-400">Workspaces</SelectLabel>
            <Separator className="my-2" />
            {workspace?.workspace?.length ? (
              workspace.workspace.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))
            ) : (
              <p className="text-sm text-neutral-400">No workspaces found</p>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Modal trigger={
        <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
          <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500" />
          <span className="text-neutral-400 font-semibold text-xs">Invite To Workspace</span>
        </span>
      } title="Invite To Workspace" 
        description="Invite other user to your workspace"><Search workspaceId={activeWorkspaceId} /></Modal>
          
      {/* Menu Section */}
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              title={item.title}
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              key={item.title}
              notifications={
                (item.title === "Notifications" && notificationCount) || 0
              }
            />
          ))}
        </ul>
      </nav>

      <Separator className="w-4/5 bg-[#9d9d9d]" />

     {/* Workspaces Section */}
<p className="w-full text-[#9D9D9D] font-bold mt-2">Workspaces</p>

{/* First show the workspaces you own (type PUBLIC only) */}
{workspace.workspace
  .filter((w) => w.type !== "PERSONAL")
  .map((w) => (
    <SidebarItem
      key={w.id}
      title={w.name}
      notifications={0}
      href={`/dashboard/${w.id}`}
      selected={pathName === `/dashboard/${w.id}`}
      icon={
        <WorkspacePlaceholder>
          {w.name.charAt(0)}
        </WorkspacePlaceholder>
      }
    />
))}


{workspace.members.length > 0 &&
  workspace.members.map(
    (item) => {
      if(!item.workspace) return null
      return  item.workspace.type !== "PERSONAL" && (
        <SidebarItem
          key={item.workspace.id}
          title={item.workspace.name}
          notifications={0}
          href={`/dashboard/${item.workspace.id}`}
          selected={pathName === `/dashboard/${item.workspace.id}`}
          icon={
            <WorkspacePlaceholder>
              {item.workspace.name.charAt(0)}
            </WorkspacePlaceholder>
          }
        />
      )}
)}
    
     

{/* If still no workspaces, show the empty state */}
{workspace.workspace.length === 1 && workspace.members.length === 0 && (
  <div className="w-full h-full flex justify-center items-center">
    <p className="text-[#3c3c3c] font-medium text-sm">
      {workspace?.subscription?.plan === "FREE"
        ? "Upgrade to create workspace"
        : "No Workspace"}
    </p>
  </div>
)}

        
      

      {/* Upgrade Section */}
      <Separator className="w-4/5 bg-[#9d9d9d]" />
      {workspace?.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summaries, and more."
          footer={
            <PaymentButton/>
          }
        >
          .
        </GlobalCard>
      )}
    </div>
  );

  return (
    <div className="full">
      <InfoBar />
      {/* SHEET for Mobile and Desktop */}
      <div className="md:hidden fixed my-4 z-50">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="p-0 w-fit h-full bg-[#111111] shadow-lg"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;