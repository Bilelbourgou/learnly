import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import VapiControls from "@/components/VapiControls";
import { SignInButton } from "@clerk/nextjs";

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Optional auth
    const { userId } = await auth();

    if (!userId) {
        return (
            <main className="min-h-screen bg-bg-primary pt-24 pb-12">
                <div className='wrapper'>
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors group">
                        <div className="p-2 rounded-full bg-bg-secondary group-hover:bg-border-subtle transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                    </Link>

                    <div className="max-w-2xl mx-auto py-20 text-center space-y-6 bg-white rounded-[2.5rem] shadow-soft border border-border-subtle p-8">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/5 flex items-center justify-center mx-auto">
                            <Lock className="w-8 h-8 text-accent-blue" />
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Protected Content</h1>
                        <p className="text-text-secondary">
                            You need to be signed in to access the AI assistant and interactive features for this book.
                        </p>
                        <SignInButton mode="modal">
                            <button className="px-8 py-3 bg-accent-blue text-white font-bold rounded-full hover:bg-accent-blue-hover transition-all shadow-md active:scale-95">
                                Sign In to View Book
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </main>
        );
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
