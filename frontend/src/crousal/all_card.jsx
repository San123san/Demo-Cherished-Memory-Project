import React from 'react'
import { useState, useEffect } from 'react'
import thumbDown from '../images/thumbDown.png'

function all_card({ username, images, topic, description, uploadDate, imgid }) {
  return (
    <>
    <div className='p-5 '>
        <div className='rounded-md p-3 px-10 pb-5 hover:shadow-2xl bg-zinc-300'>


          <div className='flex pb-5 justify-around border-b-2 place-items-center'>
            <div className='flex space-x-5 place-items-center'>
              <div className='border-2 px-2 py-1 font-medium text-xl rounded-md'>{username}</div>
              <div className='border-2 rounded-md px-2 py-1 cursor-pointer'>Comment</div>
            </div>
            <div className='flex place-items-center space-x-5'>
              <div className='w-[35px] h-[35px] cursor-pointer p-1 rounded-md 
              hover:bg-slate-200'>
                <img src={thumbDown} alt="" /></div>
            </div>

          </div>


          <div className='flex  pt-3'>
            <div className='bg-white flex items-center justify-center'>
              <img className='w-60 h-60 object-contain border-2 rounded-md' src={images} alt="" />
            </div>

            <div className='flex flex-col w-[115px]'>

              <div className='flex justify-center'>
                <div className='font-bold text-xl '>{topic}</div>
              </div>

              <div className='flex justify-center'>
                <div className='font-medium'>{description}</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

export default all_card