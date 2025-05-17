import React from "react";
import { redirect } from "next/navigation";
import { getNotifications, getUserProfile, onAuthenticateUser } from "@/actions/user";
import { getAllUserVideos, getWorkspaceFolders, getWorkspaces, verifyAccesToWorkspace } from "@/actions/workspace";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/global/sidebar";
import GlobalHeader from "@/components/global/global-header";

type Props = {
  params: {
    workspaceId: string;
  };
  children: React.ReactNode;
};

const Layout = async ({ params, children }: Props) => {
  // Await params before destructuring
  const { workspaceId } = await params;

  // Authenticate user
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) return redirect('/auth/sign-in');
  if (!auth.user.workspace.length) return redirect('/auth/sign-in');

  // Verify access to the workspace
  const hasAccess = await verifyAccesToWorkspace(workspaceId);
  if (hasAccess.status !== 200) {
    return redirect(`/dashboard/${auth.user.workspace[0].id}`);
  }
  if (!hasAccess.data?.workspace) return null;

  // Prefetch data
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['workspace-folders'],
      queryFn: () => getWorkspaceFolders(workspaceId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['user-videos', workspaceId],
      queryFn: () => getAllUserVideos(workspaceId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['user-workspaces'],
      queryFn: () => getWorkspaces(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['user-notifications'],
      queryFn: () => getNotifications(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['user-profile'],
      queryFn: () => getUserProfile(),
    }),
  ]);
  

  // Render layout
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <Sidebar activeWorkspaceId={workspaceId} />
        {/* Main Content */}
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.data.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;