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
                  <FormLabel className="text-base font-bold text-text-primary mb-2">Book PDF File</FormLabel>
                  <FormControl>
                    <div className="group transition-all">
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
                        <div className="flex items-center gap-3 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                          <Upload className="w-5 h-5 text-accent-blue" />
                          <span className="text-sm font-semibold text-accent-blue truncate flex-1">
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            className="p-1 hover:bg-accent-blue/10 rounded-full text-accent-blue transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                              if (pdfInputRef.current)
                                pdfInputRef.current.value = "";
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-3xl bg-bg-secondary cursor-pointer hover:border-accent-blue hover:bg-accent-blue/5 transition-all group"
                          onClick={() => pdfInputRef.current?.click()}
                        >
                          <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-accent-blue" />
                          </div>
                          <span className="text-base font-bold text-text-primary">
                            Click to upload PDF
                          </span>
                          <span className="text-xs text-text-muted mt-1">
                            PDF file up to 50MB
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-error text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-text-primary">
                    Cover Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="group transition-all">
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
                        <div className="flex items-center gap-3 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                          <ImageIcon className="w-5 h-5 text-accent-blue" />
                          <span className="text-sm font-semibold text-accent-blue truncate flex-1">
                            {selectedCover.name}
                          </span>
                          <button
                            type="button"
                            className="p-1 hover:bg-accent-blue/10 rounded-full text-accent-blue transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                              if (coverInputRef.current)
                                coverInputRef.current.value = "";
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-3xl bg-bg-secondary cursor-pointer hover:border-accent-blue hover:bg-accent-blue/5 transition-all group"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-accent-blue" />
                          </div>
                          <span className="text-base font-bold text-text-primary">
                            Click to upload cover image
                          </span>
                          <span className="text-xs text-text-muted mt-1">
                            Leave empty to auto-generate from PDF
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-error text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

            {/* ── Title Input ── */}
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-text-primary">Title</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="w-full px-5 py-3 bg-bg-secondary rounded-2xl text-base font-medium text-text-primary placeholder:text-text-muted border border-transparent focus:border-accent-blue focus:bg-white outline-none transition-all shadow-sm"
                      placeholder="ex: Rich Dad Poor Dad"
                    />
                  </FormControl>
                  <FormMessage className="text-error text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

            {/* ── Author Input ── */}
            <FormField
              control={form.control as any}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-text-primary">Author Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="w-full px-5 py-3 bg-bg-secondary rounded-2xl text-base font-medium text-text-primary placeholder:text-text-muted border border-transparent focus:border-accent-blue focus:bg-white outline-none transition-all shadow-sm"
                      placeholder="ex: Robert Kiyosaki"
                    />
                  </FormControl>
                  <FormMessage className="text-error text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

            {/* ── Voice Selector ── */}
            <FormField
              control={form.control as any}
              name="persona"
               render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-text-primary">
                    Choose Assistant Voice
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Male Voices */}
                      <div>
                        <p className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
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
                                className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${
                                  isSelected
                                    ? "bg-accent-blue/5 border-accent-blue shadow-sm"
                                    : "bg-white border-border-subtle hover:bg-bg-secondary"
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
                                <div className="flex items-center gap-3 w-full">
                                  <div
                                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "border-accent-blue bg-accent-blue"
                                        : "border-border-medium bg-transparent"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-text-primary lowercase tracking-tight">
                                      {voice.name}
                                    </p>
                                    <p className="text-xs text-text-secondary leading-tight mt-0.5">
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
                        <p className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
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
                                className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${
                                  isSelected
                                    ? "bg-accent-blue/5 border-accent-blue shadow-sm"
                                    : "bg-white border-border-subtle hover:bg-bg-secondary"
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
                                <div className="flex items-center gap-3 w-full">
                                  <div
                                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "border-accent-blue bg-accent-blue"
                                        : "border-border-medium bg-transparent"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-text-primary lowercase tracking-tight">
                                      {voice.name}
                                    </p>
                                    <p className="text-xs text-text-secondary leading-tight mt-0.5">
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
              className="w-full h-12 rounded-full bg-accent-blue text-white font-bold text-lg hover:bg-accent-blue-hover hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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