import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between items-center bg-white shadow-md px-8 fixed h-16 w-full top-0 left-0">
         <Image src="/logo.png" width={100} height={50} alt="logo" />

            <div className="flex flex-row gap-4">
                <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </div>
    </div>

  )
}

export default Navbar