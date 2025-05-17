import CommentForm from '@/components/forms/comment-form'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import CommentCard from '../comment-card'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import { VideoCommentProps } from '@/types/index.type'

type Props = {
    author : string
    videoId : string
}

const Activities = ({author,videoId}: Props) => {
  // Fetch video comments
  const {data, isLoading} = useQueryData(['video-comments'],()=> getVideoComments(videoId))
  
  // Safely extract comments with proper type checking
  const comments = data && (data as VideoCommentProps)?.data
  
  return (
    <TabsContent value='Activity'
                 className='p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-5'>
      <CommentForm author={author} videoId={videoId}/>
      
      {isLoading ? (
        <div className="text-gray-400 text-center py-4">Loading comments...</div>
      ) : comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard 
            comment={comment.comment}
            key={comment.id}
            author={{
              image: comment.User?.image || '',
              firstname: comment.User?.firstname || '',
              lastname: comment.User?.lastname || '',
            }}
            videoId={videoId}
            reply={comment.reply}
            commentId={comment.id} 
          />
        ))
      ) : (
        <div className="text-gray-400 text-center py-4">No comments yet</div>
      )}
    </TabsContent>
  )
}

export default Activities