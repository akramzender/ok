import { z } from "zod";

export const editVideoInfoSchema = z.object({
    title: z.string().min(5, {message: "Video title must be at least 5 characters long"}),
    description: z.string().min(100, {message: "Video description must be at least 100 characters long"})
})
