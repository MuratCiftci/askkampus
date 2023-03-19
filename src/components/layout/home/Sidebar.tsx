import React from 'react'

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between items-center shadow-md px-8 fixed h-screen w-64 top-12 left-0 overflow-y-auto  border-r border-gray-300  dark:border-slate-400">
       <div  className="flex flex-col gap-4">
            <a href="#" >Home</a>
            <a href="#" >About</a>
            <a href="#" >Contact</a>
        </div>
 
    </div>

  )
}

export default Sidebar