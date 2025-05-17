"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string, {
   // Specify the latest Stripe API version
});

// Helper to send email
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  if (!process.env.MAILER_EMAIL || !process.env.MAILER_PASSWORD) {
    console.error("⛔ Missing email credentials in environment variables.");
    return { success: false, error: "Missing email credentials" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.response);
    return { success: true };
  } catch (error) {
    console.error("⛔ Email error:", error);
    return { success: false, error};
  }
};

// Authenticate user
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403, message: "Unauthorized" };
    }

    // Check if the user already exists in the database
    const userExists = await client.user.findUnique({
      where: { clerkid: user.id },
      include: { workspace: true, subscription: true },
    });

    if (userExists) {
      return { status: 200, user: userExists };
    }

    // Create a new user in the database
    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "unknown@example.com",
        firstname: user.firstName ?? "Unknown",
        lastname: user.lastName ?? "User",
        image: user.imageUrl ?? "",
        studio: { create: {} },
        subscription: { create: {} },
        workspace: {
          create: {
            name: `${user.firstName ?? "User"}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: true,
      },
    });

    if (newUser) {
      return { status: 200, user: newUser };
    }

    return { status: 400, message: "Failed to create user" };
  } catch (error) {
    console.error("⛔ Error in onAuthenticateUser:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Get Notifications
export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403, message: "Unauthorized" };

    const notifications = await client.user.findUnique({
      where: { clerkid: user.id },
      select: {
        notification: true,
        _count: { select: { notification: true } },
      },
    });

    if (notifications) {
      return {
        status: 200,
        data: {
          notification: notifications.notification,
          count: notifications._count?.notification ?? 0,
        },
      };
    }

    return { status: 404, data: { notification: [], count: 0 } };
  } catch (error) {
    console.error("⛔ Error in getNotifications:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Complete Subscription
export const completeSubscription = async (session_id: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403, message: "Unauthorized" };

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session) {
      const customer = await client.user.update({
        where: { clerkid: user.id },
        data: {
          subscription: {
            update: {
              customerId: session.customer as string,
              plan: "PRO",
            },
          },
        },
      });

      if (customer) return { status: 200, message: "Subscription completed" };
    }

    return { status: 404, message: "Session not found" };
  } catch (error) {
    console.error("⛔ Error in completeSubscription:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Invite Members
export const inviteMembers = async (
  workspaceId: string,
  receiverId: string,
  email: string
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403, message: "Unauthorized" };

    const [senderInfo, receiverInfo, workspace] = await Promise.all([
      client.user.findUnique({
        where: { clerkid: user.id },
        select: { id: true, firstname: true, lastname: true },
      }),
      client.user.findUnique({
        where: { id: receiverId },
        select: { firstname: true, lastname: true },
      }),
      client.workspace.findUnique({
        where: { id: workspaceId },
        select: { name: true },
      }),
    ]);

    if (!senderInfo || !receiverInfo || !workspace) {
      return { status: 404, message: "Missing data" };
    }

    const invitation = await client.invite.create({
      data: {
        senderId: senderInfo.id,
        receiverId,
        workSpaceId: workspaceId,
        content: `You are invited to join ${workspace.name} Workspace, click accept to confirm.`,
      },
      select : {id:true}
    });
    const notification = await client.user.update({
      where: {
        clerkid: user.id
      },
      data : {
        notification:{
          create:{
            content: `${user.firstName} ${user.lastName} invited ${receiverInfo.firstname} into ${workspace.name}`
          }
        }
      }
    })
    console.log("Notification created:", notification);
    const emailResult = await sendEmail(
      email,
      "You got an invitation 🚀",
      `You are invited to join ${workspace.name} Workspace.`,
      `
          <body style="margin:0;padding:0;width:100%;height:100%;font-family:Arial,sans-serif;background-color:#121212;color:#ffffff;">
            <div style="max-width:600px;margin:0 auto;background-color:#1e1e1e;border-radius:8px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,0.3);">
              <!-- Header -->
              <div style="background-color:#00a87e;padding:20px;text-align:center;">
                <h1 style="margin:0;font-size:24px;color:#ffffff;">You Got a Viewer!</h1>
              </div>
              <!-- Body -->
              <div style="padding:20px;text-align:center;">
                <p style="margin:0 0 20px;line-height:1.6;">Hi,</p>
                 <a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}">Accept Invite</a>
              </div>
              <!-- Footer -->
              <div style="margin-top:20px;padding:10px;text-align:center;background-color:#1e1e1e;font-size:12px;color:#7d7d7d;">
                <p>&copy; 2025 Odix. All rights reserved.</p>
              </div>
            </div>
          </body>
     `
    );

    if (!emailResult.success) {
      return { status: 400, message: "Failed to send email" };
    }

    return { status: 200, message: "Invite sent successfully" };
  } catch (error) {
    console.error("⛔ Error in inviteMembers:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getUserProfile = async ()=> {
  try {
    const user = await currentUser()
    if(!user) return {status : 404}
  
    const profileIdAndImage = await client.user.findUnique({
      where : {
        clerkid : user.id
      },
      select: {
        image :true,
        id:true
      }
    })
    if(profileIdAndImage) return {status : 200 , data : profileIdAndImage}
  }
  catch(error){
    console.error("⛔ Error in getUserProfile:", error);
    return {status : 400}
  }}

export const searchUsers = async (query:string)=> {
  try {
    const user = await currentUser()
    if(!user) return {status : 404}
    const users = await client.user.findMany({
      where : {
        OR : [
          {firstname : {contains:query}},
          {lastname : {contains:query}},
          {email : {contains:query}}
        ],
        NOT: [{clerkid:user.id}]
      },
      select : {
        id : true,
        subscription : {
          select : {
            plan : true
          }
        },
        firstname : true,
        lastname : true,
        image : true,
        email : true
      }
    })
    if(users && users.length > 0){
      return {status: 200 , data : users}
    }
    return {status : 404 , data : undefined}
  }catch (error){
    console.error("⛔ Error in searchUsers:", error);
    return {status : 500}
  }
}

export const acceptInvite = async (inviteId: string) => {
  try {
    // Get the current user
    const user = await currentUser();
    if (!user) return { status: 404, message: "User not found" };

    // Find the invitation details
    const invitation = await client.invite.findUnique({
      where: { id: inviteId },
      select: {
        workSpaceId: true,
        receiver: {
          select: { clerkid: true },
        },
      },
    });

    // Validate the invitation
    if (!invitation) return { status: 404, message: "Invitation not found" };
    if (user.id !== invitation.receiver?.clerkid) {
      return { status: 401, message: "Not authorized to accept this invitation" };
    }

    // Prepare transaction operations
    const acceptInvite = client.invite.update({
      where: { id: inviteId },
      data: { accepted: true },
    });

    const updateMember = client.user.update({
      where: { clerkid: user.id },
      data: {
        members: {
          create: {
            workspaceId: invitation.workSpaceId,
          },
        },
      },
    });

    // Execute transaction
    await client.$transaction([acceptInvite, updateMember]);

    // Return success response
    return { status: 200, message: "Invitation accepted successfully" };
  } catch (error) {
    console.error("⛔ Error in acceptInvite:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getVideoComments = async (id:string)=> {
  try {
    const comments = await client.comment.findMany({
      where:{
        OR :[{videoId:id},{commentId:id}],
        commentId:null
      },
      include :{
        reply : {
          include :{
            User:true
          }
        },
        User : true
      }
    })
    if(comments && comments.length > 0) return {status : 200 , data : comments}
    return {status : 404}
  }catch(error){
    console.error("⛔ Error in getVideoComments:", error);
    return {status : 400}
  }
}

export const createCommentAndReply = async (
  userId : string,
  comment : string,
  videoId : string,
  commentId : string | undefined
)=>{
  try {
    if(commentId){
      const reply = await client.comment.update({
        where : {
          id : commentId
        },
        data :{
          reply : {
            create : {
              comment,
              userId,
              videoId
            }
          }
        }
      })
      if(reply){
        return {status : 200 , data :'reply posted'}
      }
    }
    const newComment = await client.video.update({
      where : {
        id: videoId
      },
      data : {
        comment : {
          create : {
            comment,
            userId
          }
        }
      }
    })
    if(newComment) return {status: 200 , data :'New Comment Added'}
  }catch (error){
    console.error("⛔ Error in getVideoComments:", error);
    return {status :400}
  }
}


export const getPaymentInfo = async()=> {
  try{
    const user = await currentUser();
    if (!user) return { status: 404}

    const payment = await client.user.findUnique({
      where:{
        clerkid: user.id
      },
      select : {
        subscription :{
          select: { plan : true}
        }
      }
    })
    if (payment){
      return { status : 200 , data : payment}
    }
  }catch(error){
    console.error("⛔ Error in getPaymentInfo:", error);
    return {status :400}
  }
}

export const getFirstView = async ()=> {
  try{
    const user = await currentUser()
    if(!user) return {status : 404}
  const userData = await client.user.findUnique({
    where : {
      clerkid : user.id
    },
    select : {
      firstView: true
    }
  })
  if(userData){
    return {status : 200 , data : userData.firstView}
  }
  return {status : 400 , data : false}
  }catch (error){
    console.error("⛔ Error in getFirstView:", error);
    return {status : 200}
  }
}

export const enableFirstView = async (state:boolean)=> {
  try{
    const user = await currentUser()
    if(!user) return {status : 404}
    const view = await client.user.update({
      where:{
        clerkid:user.id
      },
      data : {
        firstView: state
      }
    })
    if (view){
      return {status : 200 , data :'Settings updated'}
    }
  }catch(error ){
    console.error("⛔ Error in enableFirstView:", error);
    return {status : 400}
  }
}