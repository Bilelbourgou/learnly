"use client";

import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon, X } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import {
  voiceOptions,
  voiceCategories,
  DEFAULT_VOICE,
} from "@/lib/constants";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { BookUploadFormValues } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { checkBookExists ,createBook} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile, generateSlug } from "@/lib/utils";
import {upload} from "@vercel/blob/client";
import {saveBookSegments} from "@/lib/actions/book.actions";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {userId} = useAuth();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema) as any,
    defaultValues: {
      title: "",
      author: "",
      persona: DEFAULT_VOICE,
      file: undefined,
      coverImage: undefined,
    },
  });

  const selectedFile = form.watch("file");
  const selectedCover = form.watch("coverImage");

  const onSubmit = async (data: BookUploadFormValues) => {

    if(!userId) {
      return toast.error("Please login to continue")
    };

    setIsSubmitting(true);
    // TODO: PostHog -> Track book Uploads
    try {
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck.exists && existsCheck.book){
        toast.info("Book already exists,Please try with another title")
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`)
        return;
      }

      const fileTitle = generateSlug(data.title);
      const pdfFile = data.file;
      const parsedPDF = await parsePDFFile(pdfFile);
      
      let uploadedPdfBlob;
      try {
        console.log("Starting PDF upload...", { fileTitle, type: pdfFile.type });
        uploadedPdfBlob = await upload(`${fileTitle}.pdf`,pdfFile,{
          access:"private",
          handleUploadUrl:"/api/upload",
          contentType: pdfFile.type,
        });
        console.log("PDF uploaded successfully:", uploadedPdfBlob.url);
      } catch (err: any) {
        console.error("PDF upload failed details:", {
          message: err.message,
          name: err.name,
          stack: err.stack,
          raw: err
        });
        throw err;
      }

      let coverUrl:string;
      
      if (data.coverImage){
        const coverFile = data.coverImage;
        const coverFileName = `${fileTitle}-cover.png`;
        try {
          console.log("Starting manual cover upload...");
          const uploadedCoverBlob = await upload(coverFileName,coverFile,{
            access:"private",
            handleUploadUrl:"/api/upload",
            contentType:coverFile.type,
          })
          coverUrl = uploadedCoverBlob.url;
          console.log("Manual cover uploaded successfully:", coverUrl);
        } catch (err: any) {
          console.error("Manual cover upload failed details:", err);
          throw err;
        }
      }else {
        const response = await fetch(parsedPDF.cover)
        const blob = await response.blob();
        const coverFileName = `${fileTitle}-cover.png`;
        try {
          console.log("Starting auto-generated cover upload...");
          const uploadedCoverBlob = await upload(coverFileName,blob,{
            access:"private",
            handleUploadUrl:"/api/upload",
            contentType:blob.type,
          })
          coverUrl = uploadedCoverBlob.url; 
          console.log("Auto-generated cover uploaded successfully:", coverUrl);
        } catch (err: any) {
          console.error("Auto-generated cover upload failed details:", err);
          throw err;
        }
      }
      if(parsedPDF.content.length === 0){
        toast.error("Failed to parse PDF content. Please try again.");
        return;
      }

      const book = await createBook({
        clerkId:userId,
        title:data.title,
        author:data.author,
        persona:data.persona,
        fileURL:uploadedPdfBlob.url,
        fileBlobKey:uploadedPdfBlob.pathname,
        coverURL:coverUrl,
        fileSize:pdfFile.size,
      })

      if (!book.success) throw new Error("Failed to create book !");
      
        if (book.alreadyExists){
        toast.info("Book already exists,Please try with another title")
        form.reset();
        router.push(`/books/${book.data.slug}`)
        return;
      }

      const segments = await saveBookSegments(book.data._id,userId,parsedPDF.content)
    
      if (!segments.success) {
        throw new Error("Failed to save book segments !");
      }

      form.reset();
      router.push(`/`)

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-8"
          >
            {/* ── PDF File Upload ── */}
            <FormField
              control={form.control as any}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Book PDF File</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        type="file"
                        ref={pdfInputRef}
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }}
                      />

                      {selectedFile ? (
                        <div className="upload-dropzone upload-dropzone-uploaded border border-dashed border-[#8B7355] flex-row gap-3">
                          <Upload className="w-5 h-5 text-[#663820]" />
                          <span className="upload-dropzone-text text-[#663820] text-base">
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            className="upload-dropzone-remove ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                              if (pdfInputRef.current)
                                pdfInputRef.current.value = "";
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="upload-dropzone border border-dashed border-[var(--border-medium)]"
                          onClick={() => pdfInputRef.current?.click()}
                        >
                          <Upload className="upload-dropzone-icon" />
                          <span className="upload-dropzone-text">
                            Click to upload PDF
                          </span>
                          <span className="upload-dropzone-hint">
                            PDF file (max 50MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Cover Image Upload ── */}
            <FormField
              control={form.control as any}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">
                    Cover Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <div>
                      <input
                        type="file"
                        ref={coverInputRef}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }}
                      />

                      {selectedCover ? (
                        <div className="upload-dropzone upload-dropzone-uploaded border border-dashed border-[#8B7355] flex-row gap-3">
                          <ImageIcon className="w-5 h-5 text-[#663820]" />
                          <span className="upload-dropzone-text text-[#663820] text-base">
                            {selectedCover.name}
                          </span>
                          <button
                            type="button"
                            className="upload-dropzone-remove ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                              if (coverInputRef.current)
                                coverInputRef.current.value = "";
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="upload-dropzone border border-dashed border-[var(--border-medium)]"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          <ImageIcon className="upload-dropzone-icon" />
                          <span className="upload-dropzone-text">
                            Click to upload cover image
                          </span>
                          <span className="upload-dropzone-hint">
                            Leave empty to auto-generate from PDF
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Title Input ── */}
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="form-input border-b border-[var(--border-medium)] focus:border-[#663820] outline-none transition-colors"
                      placeholder="ex: Rich Dad Poor Dad"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Author Input ── */}
            <FormField
              control={form.control as any}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="form-input border-b border-[var(--border-medium)] focus:border-[#663820] outline-none transition-colors"
                      placeholder="ex: Robert Kiyosaki"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Voice Selector ── */}
            <FormField
              control={form.control as any}
              name="persona"
               render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">
                    Choose Assistant Voice
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Male Voices */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                          Male Voices
                        </p>
                        <div className="voice-selector-options">
                          {voiceCategories.male.map((key) => {
                            const voice =
                              voiceOptions[
                                key as keyof typeof voiceOptions
                              ];
                            const isSelected = field.value === key;
                            return (
                              <label
                                key={key}
                                className={`voice-selector-option ${
                                  isSelected
                                    ? "voice-selector-option-selected"
                                    : "voice-selector-option-default"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="voice"
                                  value={key}
                                  checked={isSelected}
                                  onChange={() => field.onChange(key)}
                                  className="sr-only"
                                />
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "border-[var(--accent-warm)]"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                                      {voice.name}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] leading-tight">
                                      {voice.description}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Female Voices */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                          Female Voices
                        </p>
                        <div className="voice-selector-options">
                          {voiceCategories.female.map((key) => {
                            const voice =
                              voiceOptions[
                                key as keyof typeof voiceOptions
                              ];
                            const isSelected = field.value === key;
                            return (
                              <label
                                key={key}
                                className={`voice-selector-option ${
                                  isSelected
                                    ? "voice-selector-option-selected"
                                    : "voice-selector-option-default"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="voice"
                                  value={key}
                                  checked={isSelected}
                                  onChange={() => field.onChange(key)}
                                  className="sr-only"
                                />
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "border-[var(--accent-warm)]"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                                      {voice.name}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] leading-tight">
                                      {voice.description}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Submit Button ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="form-btn"
            >
              {isSubmitting ? "Processing..." : "Begin Synthesis"}
            </button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UploadForm;