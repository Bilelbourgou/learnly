import { z } from "zod";
import {
    MAX_FILE_SIZE,
    ACCEPTED_PDF_TYPES,
    MAX_IMAGE_SIZE,
    ACCEPTED_IMAGE_TYPES,
    DEFAULT_VOICE,
} from "@/lib/constants";

export const UploadSchema = z.object({
    file: z
        .custom<File>()
        .refine((file) => file instanceof File, "Please upload a PDF file")
        .refine((file) => file?.size <= MAX_FILE_SIZE, "File must be less than 50MB")
        .refine(
            (file) => ACCEPTED_PDF_TYPES.includes(file?.type),
            "Only PDF files are accepted"
        ),
    coverImage: z
        .custom<File>()
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_IMAGE_SIZE,
            "Image must be less than 10MB"
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only JPEG, PNG, and WebP images are accepted"
        ),
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    author: z
        .string()
        .min(1, "Author name is required")
        .max(200, "Author name must be less than 200 characters"),
    persona: z.string().default(DEFAULT_VOICE),
});
