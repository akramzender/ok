import React, { useState } from 'react';
import CommentForm from '@/components/forms/comment-form';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CommentRepliesProps } from '@/types/index.type';

// Props type definition
type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply?: boolean;
};

const CommentCard = ({ comment, author, videoId, commentId, reply, isReply }: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);

  // Render the main CommentCard UI
  return (
    <Card
      className={cn(
        isReply
          ? 'bg-[#1d1d1d] pl-10 border-none' // Styling for replies
          : 'border-[1px] bg-[#1d1d1d] p-5' // Styling for main comment
      )}
    >
      {/* Author Section */}
      <div className="flex gap-x-2 items-center">
        <Avatar className="w-6 h-6">
          <AvatarImage
            src={author.image || '/fallback-avatar.png'} // Fallback image
            alt={`${author.firstname} ${author.lastname}`}
            className="object-cover w-full h-full"
          />
        </Avatar>
        <p className="capitalize text-sm font-medium text-[#bdbdbd]">
          {author.firstname} {author.lastname}
        </p>
      </div>

      {/* Comment Text Section */}
      <div>
        <p className="text-[#ede7e7]">{comment}</p>
      </div>

      {/* Reply Button or Form Section */}
      {!isReply && (
        <div className="flex justify-end mt-1">
          {!onReply ? (
            <Button
              onClick={() => setOnReply(true)}
              className="text-sm rounded-full bg-[#252525] text-white px-4 py-1 hover:bg-[#3a3a3a] transition-all duration-200"
            >
              Reply
            </Button>
          ) : (
            <CommentForm
              close={() => setOnReply(false)}
              videoId={videoId}
              commentId={commentId}
              author={`${author.firstname} ${author.lastname}`}
            />
          )}
        </div>
      )}

      {/* Nested Replies Section */}
      {reply.length > 0 && (
        <div className="flex flex-col gap-y-10 mt-5">
          {reply.map((r) => (
            <CommentCard
              key={r.id}
              isReply
              reply={[]} // Nested replies are not passed further
              comment={r.comment}
              commentId={r.commentId!}
              videoId={videoId}
              author={{
                image: r.User?.image || '/fallback-avatar.png',
                firstname: r.User?.firstname || 'Unknown',
                lastname: r.User?.lastname || 'User',
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentCard;