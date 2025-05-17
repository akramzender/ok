import { useEditVideo } from '@/hooks/useVideoEdit'
import React from 'react'
import FormGenerator from '@/components/global/form-generator'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'
type Props = {
    videoId: string,
    title: string,
    description: string
}

const EditVideoForm = ({videoId, title, description}: Props) => {
  const {errors,onFormSubmit,register,isPending} = useEditVideo(videoId,title,description)
    return (
    <form onSubmit={onFormSubmit} className='flex flex-col gap-y-5'>
        <FormGenerator
            register={register}
            errors={errors}
            name='title'
            inputType='input'
            placeholder='Video Title'
            type='text'
            label='Title'
        />
        <FormGenerator
            register={register}
            label='Description'
            errors={errors}
            name='description'
            inputType='textarea'
            placeholder='Video Description'
            lines={5}
        />

        <Button  className="text-sm w-full mt-2 cursor-pointer bg-amber-50 text-black" type='submit' disabled={isPending}>
            <Loader
                state={isPending}
                className="text-sm w-full items-center justify-center bg-amber-50 cursor-pointer text-black rounded-full"
            >
                Save
            </Loader>
        </Button>
    </form>
  )
}

export default EditVideoForm;