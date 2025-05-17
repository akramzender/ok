import React from 'react'
import Modal from '../modal';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import EditVideoForm from '@/components/forms/edit-video';
type Props = {title: string, description: string , videoId: string}

const EditVideo = ({title, description, videoId}: Props) => {
  return (
    <Modal
    title="Edit Video"
    description="Edit the video details"
    trigger={<Button variant={"ghost"} ><Edit className='text-[#454545]'/></Button>}
    >
        <EditVideoForm videoId={videoId} title={title} description={description} />
    </Modal>
  )
}

export default EditVideo;