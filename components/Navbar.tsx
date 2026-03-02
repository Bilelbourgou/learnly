import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <header className="w-full fixedz-50 bg-[--bg-primary]">
    <div className='wrapper navbar-height py-4 flex justify-between items-center'>
       <Link href="/">
        <Image src="/logo.png" alt="Logo" width={42} height={26} />
       </Link> 

    </div>
    </header>
  )
}

export default Navbar