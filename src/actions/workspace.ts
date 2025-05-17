'use server'

import { currentUser, User } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";
import { error } from "console";
import { sendEmail } from "./user";

export const verifyAccesToWorkspace = async (workspaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403, message: "Unauthorized" };
        }
        
        const isUserInWorkspace = await client.workspace.findUnique({
            where: { 
                id: workspaceId, 
                OR: [
                    {
                        User: {
                            clerkid: user.id
                        }
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid: user.id
                                }
                            }
                        }
                    }
                ]
        }
    }
);
        return { status: 200,
             data:{workspace: isUserInWorkspace},
             
            };
    } catch (error) { 
        return { 
            status: 403,
            data: { workspace: null }
        };
    }
}
export const getWorkspaceFolders = async (workspaceId: string) => {
    try {
        const isFolders = await client.folder.findMany({
            where: {
                workSpaceId: workspaceId
            },
            include: {
                _count: {
                    select: {
                        videos: true
                    }
                }
            }
        });
        
        if (isFolders && isFolders.length>0  ) {
            return { status:200, data:  isFolders};
        }
        
        return { status: 404, data: [] };
    } catch (error) {
        return { status:403, data: [] };
    }
}
export const getAllUserVideos = async (workSpaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403 };
        }
        
        const videos = await client.video.findMany({
            where: {
                OR: [
                    { workSpaceId: workSpaceId },
                    { folderId: workSpaceId }
                ]
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {   
                        id: true,
                        name: true
                    }
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        
        if(videos.length>0 && videos) {
            return { status: 200, data: videos  };
 } 
 return { status: 404 };
    } catch (error) {
        return { status: 400 };
    }
}

export const getWorkspaces = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403 };
        }
        const workspaces = await client.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    },
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                },
                members: {
                    select: {
                        workspace: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                }
            }
        });
        if (workspaces) {
            return { 
                status: 200, 
                data:  workspaces 
            };
        }
       
    } catch (error) {
        return { status: 400 };
    }
}

export const createWorkspace = async (name:string)=>{
    try{
        const user = await currentUser()
        if (!user) return {status : 404}
        const authorized = await client.user.findUnique({
            where : {
                clerkid : user.id,
            },
            select : {
                subscription:{
                    select : {
                        plan : true
                    }
                }
            }
        })
        if(authorized?.subscription?.plan === "PRO"){
            const workspace = await client.user.update({
                where: {
                    clerkid: user.id,
                },
                data:{
                    workspace:{
                        create:{
                            name,
                            type: "PUBLIC"
                        },
                    },
                },
            
            })
            
        
            if(workspace){
                return {status:200 , data : "Workspace Created"}
            }
console.log(workspace)
        }
        return {status : 401 , data : "You are not authorized to create a workspace"}
       
    }catch(error){
        return {status:400 , data : 'bla' }
    }
}
export const renameFolders = async(folderId:string , name:string) => {
    try{
        const folder = await client.folder.update({
            where: {
                id:folderId,
            },
            data:{
                name,
            }
        })
        if (folder){
            return {status : 200 , data : 'Folder Renamed'}
        }
        return{status : 400 , data : 'Folder does not exist !'}
    }catch(error){
        return {status : 500 , data :'Opps ! something went wrong'}
    }
}

export const createFolder = async (workspaceId:string)=>{
    try {
        const isNewFolder = await client.workspace.update({
            where :{
                id : workspaceId
            },
            data : {
                folders : {
                    create : {name : 'Untitled'}
                }
            }
        })
        if (isNewFolder){
            return {status : 200 , message : 'New Folder created'}
        }
       
    }catch(error){
        return {status : 500 , message : 'Opps ! something went wrong'}
    }
}
export const getFolderInfo = async (folderId:string)=> {
    try{
        const folder = await client.folder.findUnique({
            where : {
                id : folderId
            },
            select : {
                name : true,
                _count :{
                    select : {
                        videos : true
                    }
                }
            }
        })
        if (folder){
            return {status : 200 , data :folder}
        }return {status : 400 , data : null}
    }catch(error){
        return {status : 500 , data : null}
    }
}

export const moveVideoLocation = async (
    videoId : string,
    workspaceId:string,
    folderId : string,
)=>{
    try{
        const location = await client.video.update({
            where : {
                id : videoId
            },
            data : {
                folderId : folderId || undefined ,
                workSpaceId : workspaceId
            }
        })
        if (location) return {status : 200, data : 'folder changed succesfully'}
        return {status : 404 , data : 'workspace /folder not found'}
    }catch(error){
        return{status : 500 , data : 'Oops ! something went wrong'}
    }
}

export const getPreviewVideo = async (videoId : string)=>{
    try{
        const user = await currentUser()
        if (!user) return {status : 404}
        const video = await client.video.findUnique({
            where :{
                id : videoId , 
            },
            select : {
                title : true,
                createdAt : true,
                source: true,
                description : true,
                processing : true,
                views : true,
                summery : true,
                User : {
                    select : {
                        firstname : true,
                        lastname : true,
                        image : true ,
                        clerkid : true,
                        trial : true ,
                        subscription : {
                            select : {
                                plan : true ,
                            },
                        },
                    },
                },
            },
        })
        if(video){
            return {
                status : 200 ,
                data : video,
                author :user.id === video.User?.clerkid ? true : false
            }
        }
        return {
            status : 404
        }
    } catch (error) {
        return{status : 400}
    }
}

export const sendEmailForFirstView = async (videoId: string) => {
    try {
      const user = await currentUser();
      if (!user) return { status: 404 };
  
      // Check user's firstView settings
      const firstViewSettings = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          firstView: true,
        },
      });
      if (!firstViewSettings?.firstView) return { status: 404 };
  
      // Fetch video details
      const video = await client.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          views: true,
          User: {
            select: {
              email: true,
            },
          },
        },
      });
      if (!video) return { status: 404 };
  
      // Increment view count if it's the first view
      if (video.views === 0) {
        await client.video.update({
          where: {
            id: videoId,
          },
          data: {
            views: video.views + 1,
          },
        });
      }
  
      // Send email notification
      const emailResult = await sendEmail(
        video.User?.email!,
        "You got a viewer 🚀",
        `Your video "${video.title}" just got its first viewer.`,
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
                <p style="margin:0 0 20px;line-height:1.6;">Your video "${video.title}" just got its first viewer!</p>
              </div>
              <!-- Footer -->
              <div style="margin-top:20px;padding:10px;text-align:center;background-color:#1e1e1e;font-size:12px;color:#7d7d7d;">
                <p>&copy; 2025 Odix. All rights reserved.</p>
              </div>
            </div>
          </body>
        `
      );
  
      // Handle email success or failure
      if (!emailResult.success) {
        console.error("⛔ Email failed to send:", emailResult.error);
        return { status: 500, message: "Failed to send email" };
      }
  
      // Create notification for the user
      const notification = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          notification: {
            create: {
              content: `Your video "${video.title}" just got its first viewer.`,
            },
          },
        },
      });
  
      if (notification) {
        return { status: 200, message: "Email sent and notification created" };
      }
  
      return { status: 500, message: "Failed to create notification" };
    } catch (error) {
      console.error("⛔ Error in sendEmailForFirstView:", error);
      return { status: 500, message: "Internal server error" };
    }
  };
  export const editVideoInfo = async (videoId: string, title: string, description: string) => {
    try {
        
        const video = await client.video.update({
            where: {
                id: videoId,
            },
            data: {
                title,
                description,
            },
        });

        if (video) return { status: 200, message: "Video info updated" };
        return { status: 404, message: "Video not found" };
    } catch (error) {   
        return { status: 500, message: "Internal server error" };
    }
}

