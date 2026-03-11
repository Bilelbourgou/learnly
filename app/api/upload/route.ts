import {NextResponse} from "next/server";
import {handleUpload, HandleUploadBody} from "@vercel/blob/client"
import { auth } from "@clerk/nextjs/server"
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request:Request){
    const body = (await request.json()) as HandleUploadBody;

    try {
        console.log("Upload request received:", body.type);
        const jsonResponse = await handleUpload({
            token:process.env.BLOB_READ_WRITE_TOKEN,
            body,
            request,
                onBeforeGenerateToken:async(pathname, clientPayload)=>{
                    const {userId} = await auth()
                    console.log("Generating token for:", pathname, "User:", userId);
    
                    if (!userId){
                        throw new Error("Unauthorized");
                    }

                    // Extract access if passed in clientPayload or use a default
                    // Note: clientPayload comes from the 'clientPayload' option in upload()
                    
                    return {
                        allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
                        addRandomSuffix: true,
                        maximumSizeInBytes: MAX_FILE_SIZE,
                        tokenPayload: JSON.stringify({ userId }),
                    };
                },
                /* onUploadCompleted: async ({ blob, tokenPayload }) => {
                    console.log('File Uploaded to blob : ', blob.url);
                } */
            });
    
        console.log("Token generated successfully");
        return NextResponse.json(jsonResponse);
        } catch (error) {
            console.error("Upload error:", error);
            return NextResponse.json({error:"Internal server error"}, {status:500})
        }
    }