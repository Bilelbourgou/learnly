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
    <header className="w-full fixed z-50 bg-(--bg-primary)">
    <div className='wrapper navbar-height py-4 flex justify-between items-center'>
       <Link href="/" className='flex items-center gap-2'>
        <Image src="/logo.png" alt="Logo" width={42} height={26} />
        <span className='text-2xl font-bold tracking-tight'>Learnly</span>
       </Link> 
       <nav className='hidden md:flex items-center gap-6'>
        {navLinks.map(({href,label}) => {
            const isActive = pathName === href;
            return (
                <Link
                key={label}
                href={href}
                className={cn('nav-link-base',
                    isActive && 'nav-link-active',
                    'text-black hover:opacity-70'
                )}
                >
                {label}
                </Link>
            )
        }
        )}
       </nav>
       <div className='flex items-center gap-3'>
        <SignedOut>
          <SignInButton>
            <button className='px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer'>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className='px-4 py-2 text-sm font-medium text-white bg-[#663820] rounded-lg hover:bg-[#7a4528] transition-colors cursor-pointer'>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className='nav-user-link'>
            <UserButton />
            {user?.firstName && (
              <Link href="/subscriptions" className='nav-user-name'>
                {user.firstName}
              </Link>
            )}
          </div>
        </SignedIn>
       </div>
    </div>
    </header>
  )
}

export default Navbar