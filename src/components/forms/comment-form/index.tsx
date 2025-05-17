'use client '
import FormGenerator from '@/components/global/form-generator'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'
import { useVideoComment } from '@/hooks/useVideo'
import { Send, VideoOff, X } from 'lucide-react'
import React from 'react'

type Props = {
    videoId : string
    commentId? : string
    author : string
    close?: ()=> void

}

const CommentForm = ({videoId,commentId,author,close}: Props) => {
    const {register,isPending,errors,onFormSubmit} = useVideoComment(videoId,commentId)
    return (
    <form className=' relative w-full' onSubmit={onFormSubmit}>
            
        <FormGenerator register={register}
                        errors={errors}
                        placeholder={`Respond to ${author}...`}
                        name='comment'
                        inputType='input'
                        lines={8}
                        type='text'

        />
        <Button className=' cursor-pointer p-0 bg-transparent absolute top-[1px] right-3 hover:bg-transparent' type='submit' >
            <Loader state={isPending}>
                <Send className="text-white/50 cursor-pointer hover:text-white/80" size={18} />
            </Loader>
        </Button>
    </form>
  )
  
}

export default CommentForm