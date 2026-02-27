import { TypeAnimation } from 'react-type-animation'
import React from 'react'

export default function Investopedia({title, creator,link,pubDate, categories, guid, name }){
  
  const formatted = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  

  

  }

  const date = new Date(pubDate).toLocaleDateString('en-US',formatted)
  return(
    <>
    <a href={link} className='mb-9 text-sm hover:text-blue-400 text-gray-500'>
      
      <div className='p-6  max-w-sm border  mb-1   rounded-lg shadow-lg bg-black/80 border-gray-700  backdrop-blur-lg hover:scale-105 transition duration-300 ease-in-out ml-10'>
      <h1 className='mb-6 text-xl text-white italic text-center'>
        <TypeAnimation speed={2}  cursor={false} sequence={[title, 1000]}  repeat={Infinity} className='text-white italic ' />
        </h1>

      
      {/* <div className="relative inline-block mb-10 ml-23 mt-4  ">
        <div className="absolute  -inset-1.5 bg-yellow-600 blur-lg opacity-70 rounded-lg"></div>
        <h5 className="relative text-sm border border-yellow-500 rounded-lg px-3 py-1 bg-black text-white">
            {categories}
        </h5>
      </div> */}

      
      <div className=' mb-4 flex justify-between flex-row'>
      <h5 className='mb-2 text-green-400 text-center align-center justify-center ml-10  '>
        <TypeAnimation speed={2}  cursor={false} sequence={[date, 1000]}  repeat={Infinity} className='text-green-400 italic ' />
      </h5>

      </div>
      
      
     </div>

    </a>
     
    </>
  )
}

