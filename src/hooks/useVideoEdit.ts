import { editVideoInfoSchema } from "@/components/forms/edit-video/schema"
import useZodForm from "./useZodForm"
import { useMutation } from "@tanstack/react-query"
import { useMutationData } from "./useMutationData"
import { editVideoInfo } from "@/actions/workspace"


export const useEditVideo = (videoId: string , title: string , description: string) => {
   const {mutate, isPending} = useMutationData(["edit-video"],(
    data: {title: string, description: string})=>editVideoInfo(videoId,data.title,data.description),'preview-video'

    )
    const {errors,onFormSubmit,register} = useZodForm(
        editVideoInfoSchema,
        mutate,
        {title, description}
    )

    return {
        errors,
        onFormSubmit,
        register,
        isPending
    }
}
