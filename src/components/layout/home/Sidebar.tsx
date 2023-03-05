import React from 'react'

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between items-center bg-white shadow-md px-8 fixed h-screen w-64 top-12 left-0 overflow-y-auto">
       <div  className="flex flex-col gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
        </div>
        <div className="flex flex-col gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
        </div>
    </div>

  )
}

export default Sidebar