'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/nextjs';

const navLinks = [
  { href: "/", label: "Library" },
  { href: "/books/new", label: "Add New" },
];

const Navbar = () => {
    const pathName = usePathname();
    const { user } = useUser();
  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle">
    <div className='wrapper h-14 flex justify-between items-center'>
       <Link href="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
        <Image src="/logo.png" alt="Logo" width={32} height={20} className="w-auto h-5" />
        <span className='text-lg font-bold tracking-tight text-text-primary uppercase'>Learnly</span>
       </Link> 
       <nav className='hidden md:flex items-center gap-8'>
        {navLinks.map(({href,label}) => {
            const isActive = pathName === href;
            return (
                <Link
                key={label}
                href={href}
                className={cn('nav-link-base',
                    isActive && 'nav-link-active'
                )}
                >
                {label}
                </Link>
            )
        }
        )}
       </nav>
       <div className='flex items-center gap-4'>
        <SignedOut>
          <SignInButton>
            <button className='text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer'>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className='px-4 py-1.5 text-sm font-semibold text-white bg-accent-blue rounded-full hover:bg-accent-blue-hover transition-all cursor-pointer shadow-sm active:scale-95'>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className='flex items-center gap-4'>
            {user?.firstName && (
              <Link href="/subscriptions" className='text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'>
                {user.firstName}
              </Link>
            )}
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-8"
                }
              }}
            />
          </div>
        </SignedIn>
       </div>
    </div>
    </header>
  )
}

export default Navbar