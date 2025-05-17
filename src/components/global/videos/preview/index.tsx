'use client'
import { getPreviewVideo, sendEmailForFirstView } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoProps } from "@/types/index.type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import CopyLink from "../copy-link";
import RichLink from "../rich-link";
import { truncateString } from "@/lib/utils";
import { Download } from "lucide-react";
import TabsMenu from "../../tabs";
import AiTools from "../../ai-tools";
import VideoTranscript from "../../video-transcript";
import Activities from "../../activities";
import EditVideo from "../edit";


type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQueryData(["preview-video"], () => getPreviewVideo(videoId));
  const notifyFirstView = async () => await sendEmailForFirstView(videoId);
  const [videoError, setVideoError] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-center">
          <div className="h-32 w-32 mx-auto mb-4 rounded-full bg-gray-700"></div>
          <div className="h-6 w-48 mx-auto mb-4 rounded bg-gray-700"></div>
          <div className="h-4 w-64 mx-auto rounded bg-gray-700"></div>
          <p className="mt-4 text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError || !data || data !== 200 || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Video not found</h2>
          <p className="text-gray-400 mb-4">The video you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const { data: video, status, author } = data as VideoProps;

  // Check if video data is valid
  if (!video || !video.source) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Video unavailable</h2>
          <p className="text-gray-400 mb-4">This video might be processing or unavailable.</p>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (status === 200) router.push;
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(video.createdAt).getTime()) / (24 * 60 * 60 * 1000)
  );

  useEffect(() => {
    if (video.views === 0) {
      notifyFirstView();
    }
    
    // Fix the video URL calculation
    if (video.source) {
      let newUrl = '';
      
      // Check if it's an S3 URL
      if (video.source.includes('s3.') || video.source.includes('amazonaws.com')) {
        // Make sure S3 URL has https:// prefix
        newUrl = video.source.startsWith('http') ? video.source : `https://${video.source}`;
        console.log("Using direct S3 URL");
      } 
      // Check if it's a relative path
      else if (!video.source.startsWith('http')) {
        const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL;
        if (cloudFrontUrl) {
          // Ensure CloudFront URL has https:// prefix
          const baseUrl = cloudFrontUrl.startsWith('http') 
            ? cloudFrontUrl
            : `https://${cloudFrontUrl}`;
            
          newUrl = `${baseUrl}/${video.source}`;
          console.log("Using CloudFront URL with relative path");
        } else {
          // Fallback to direct path if no CloudFront URL is available
          newUrl = `/${video.source}`;
          console.log("No CloudFront URL found, using direct path");
        }
      } 
      // Use as is if it's already a full URL
      else {
        newUrl = video.source;
        console.log("Using full URL directly");
      }
      
      console.log("Setting video URL to:", newUrl);
      setVideoUrl(newUrl);
    } else {
      console.error("Video source is empty!");
    }

    // Cleanup
    return () => {
      notifyFirstView();
    };
  }, [video]);

  // Debug logs
  console.log("Video source:", video?.source || "MISSING");
  console.log("Final video URL:", videoUrl || "EMPTY");

  const tryDirectUrl = () => {
    if (videoRef.current && video.source) {
      // Try different URL format
      const directUrl = video.source.startsWith('http') 
        ? video.source 
        : `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`;
      
      console.log("Trying direct URL:", directUrl);
      videoRef.current.src = directUrl;
      videoRef.current.load();
      videoRef.current.play().catch(e => console.error("Play failed:", e));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 p-10 lg:px-20 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9d9d9d] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <div>
          {videoUrl ? (
            <video 
              ref={videoRef}
              preload="metadata" 
              className={`w-full aspect-video rounded-xl ${videoError ? 'opacity-25' : ''}`} 
              controls
              onError={(e) => {
                console.error("Video failed to load:", e);
                setVideoError(true);
              }}
            >
              {/* Try multiple source formats */}
              <source
                src={videoUrl}
                type="video/webm"
              />
              <source
                src={videoUrl}
                type="video/mp4"
              />
              <source
                src={`${videoUrl}#t=1`}
                type="video/webm"
              />
              <p className="text-gray-400">Your browser doesn't support HTML5 video.</p>  
            </video>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400">Video URL not available</p>
            </div>
          )}
          
          {videoError && (
            <div className="text-center mt-4">
              <p className="text-red-500 mb-2">Video failed to load</p>
              <p className="text-gray-400 text-sm">
                The video may still be processing or the URL may be incorrect.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Refresh Page
                </button>
                <button 
                  onClick={tryDirectUrl}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                >
                  Try Direct URL
                </button>
                {videoUrl && (
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700"
                  >
                    Open in New Tab
                  </a>
                )}
              </div>
              <div className="mt-4 bg-gray-900 p-3 rounded text-left text-xs overflow-auto">
                <p className="text-gray-400">Debug Info:</p>
                <p className="text-gray-500">Source: {video?.source || "MISSING"}</p>
                <p className="text-gray-500">URL: {videoUrl || "EMPTY"}</p>
                <p className="text-gray-500">CloudFront URL: {process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL || "NOT SET"}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#bdbdbd] text-semibold">Description</p>
          </div>
          <p className="text-[#9d9d9d] text-lg text-medium">{video.description}</p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-10 cursor-pointer"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
          <Download 
            className="text-[#4d4c4c] cursor-pointer"
            onClick={() => {
              if (videoUrl) {
                window.open(videoUrl, '_blank');
              }
            }}
          />
        </div>
        <div>
          <TabsMenu defaultValue="Ai Tools" triggers={["Ai Tools", "Transcript", "Activity"]}>
            <AiTools
             videoId={videoId}
             trial={video.User?.trial!}
             plan={video.User?.subscription?.plan!}
            />
            <VideoTranscript transcript={video.summery!} />
            <Activities author={video.User?.firstname as string} videoId={videoId} />
            
          </TabsMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;