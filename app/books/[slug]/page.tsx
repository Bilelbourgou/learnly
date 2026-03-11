import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MicOff, Mic, ArrowLeft } from "lucide-react";

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

    const proxiedCoverURL = (book.coverURL && book.coverURL.includes('blob.vercel-storage.com'))
        ? `/api/proxy-image?url=${encodeURIComponent(book.coverURL)}`
        : book.coverURL;

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
                    {/* Header Section */}
                    <section className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-border-subtle overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            {/* Left: Book Cover & Mic Button */}
                            <div className="relative group">
                                <div className="relative w-40 h-60 rounded-2xl overflow-hidden shadow-soft-md group-hover:shadow-soft-lg transition-all duration-300">
                                    {proxiedCoverURL ? (
                                        <Image 
                                            src={proxiedCoverURL} 
                                            alt={book.title} 
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                                            <span className="text-text-muted text-xs">No Cover</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-4 -right-4">
                                    <button className="w-14 h-14 rounded-full bg-text-primary text-white flex items-center justify-center shadow-soft-lg hover:scale-105 active:scale-95 transition-all">
                                        <MicOff className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Right: Book Details */}
                            <div className="flex-1 flex flex-col justify-center py-4">
                                <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-2">
                                    {book.title}
                                </h1>
                                <p className="text-xl font-medium text-text-secondary mb-6">
                                    by {book.author}
                                </p>
                                
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/20 rounded-full text-sm font-bold text-accent-blue tracking-tight">
                                        <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
                                        Ready
                                    </div>
                                    
                                    {book.persona && (
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border-subtle rounded-full text-sm font-bold text-text-primary tracking-tight">
                                            Voice: {book.persona}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border-subtle rounded-full text-sm font-bold text-text-secondary tracking-tight">
                                        0:00/15:00
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Transcript Area */}
                    <section className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-border-subtle min-h-[400px] flex items-center justify-center">
                        <div className="max-w-md text-center">
                            <div className="size-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-6">
                                <Mic className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">No conversation yet</h3>
                            <p className="text-text-secondary">Click the mic button to start your interactive learning journey with {book.title}.</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
