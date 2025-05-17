    import {  acceptInvite } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    inviteId: string
  }
}

const Page = async ({ params: { inviteId } }: Props) => {
  const invite = await acceptInvite(inviteId);

  if (invite.status === 404) {
    // Redirect to sign-in page if user is not found
    return redirect('/auth/sign-in');
  }

  if (invite.status === 401) {
    // Handle unauthorized access
    return (
      <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
        <h2 className="text-6xl font-bold text-white">Not Authorized</h2>
        <p>You are not authorized to accept this invite.</p>
      </div>
    );
  }

  if (invite.status === 200) {
    // Redirect to callback page if invite is accepted successfully
    return redirect('/auth/callback');
  }

  // Fallback for any other errors
  return (
    <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
      <h2 className="text-6xl font-bold text-white">Something went wrong</h2>
      <p>Could not accept the invite. Please try again later.</p>
    </div>
  );
}

export default Page;
