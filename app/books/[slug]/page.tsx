import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MicOff, Mic, ArrowLeft } from "lucide-react";
import VapiControls from "@/components/VapiControls";

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Require auth
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const { success, data: book } = await getBookBySlug(slug);

    if (!success || !book) {
        redirect("/");
    }



    return (
        <main className="min-h-screen bg-bg-primary pt-24 pb-12">
            <div className='wrapper'>
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors group">
                    <div className="p-2 rounded-full bg-bg-secondary group-hover:bg-border-subtle transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                </Link>

                <div className="max-w-4xl mx-auto space-y-8">
                 
                    <VapiControls book={book} />
                </div>
            </div> 
        </main>
    );
}
