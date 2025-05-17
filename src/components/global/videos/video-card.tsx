import React, { useState } from "react";
import Loader from "../loader";
import CardMenu from "./menu-videos";
import CopyLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Share2, User } from "lucide-react";

type Props = {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  processing: boolean;
  workspaceId: string;
};

const VideoCard = (props: Props) => {
  const [ thumbnailError, setThumbnailError] = useState(false);
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  // Format the video URL properly with https:// protocol
  const getVideoUrl = () => {
    if (!props.source) return "";
    
    // If source already has http/https, use it directly
    if (props.source.startsWith('http')) {
      return props.source;
    }
    
    // Add https:// to CloudFront URL if missing
    const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL || '';
    const baseUrl = cloudFrontUrl.startsWith('http') 
      ? cloudFrontUrl 
      : `https://${cloudFrontUrl}`;
    
    return `${baseUrl}/${props.source}`;
  };

  return (
    <Loader
      className="flex justify-center items-center"
      state={props.processing}
    >
      <div className="overflow-hidden cursor-pointer bg-[#1a1a1a] relative border border-zinc-800 flex flex-col rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-xl hover:border-zinc-700">
        {/* Options Menu and CopyLink */}
        <div className="absolute top-3 right-3 z-50 flex flex-col items-center gap-y-3">
          <CardMenu
            currentFolderName={props.Folder?.name}
            videoId={props.id}
            currentworkspace={props.workspaceId}
            currentFolder={props.Folder?.id}
          />
          <CopyLink className="p-0 h-3 bg-transparent cursor-pointer" videoId={props.id} />
        </div>

        {/* Video Preview with Thumbnail */}
        <Link
          href={`/preview/${props.id}`}
          className="hover:bg-[#232323] transition duration-200 flex flex-col justify-between h-full"
        >
          <div className="relative">
            <video
              controls={false}
              preload="metadata"
              poster={`${getVideoUrl()}#t=0.1`}
              onError={() => setThumbnailError(true)}
              className="w-full aspect-video rounded-t-lg object-cover"
            >
              <source
                src={`${getVideoUrl()}#t=1`}
                type="video/webm"
              />
            </video>
          </div>

          {/* Video Details */}
          <div className="px-4 py-3 flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-200 truncate">
              {props.title}
            </h2>
            <div className="flex gap-x-2 items-center mt-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User size={14} />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="capitalize text-sm text-gray-300">
                  {props.User?.firstname}
                </p>
                <p className="text-gray-500 text-xs flex items-center">
                  <Dot className="h-4 w-4" /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>

            {/* Workspace Info */}
            <div className="mt-2">
              <span className="flex gap-x-1 items-center">
                <Share2
                  className="text-white"
                  size={12}
                />
                <p className="text-xs text-gray-400 capitalize">
                  {props.User?.firstname}'s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export default VideoCard;