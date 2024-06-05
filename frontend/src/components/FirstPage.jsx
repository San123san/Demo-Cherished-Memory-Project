import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react';
import UserRegistration from './UserRegistration.jsx'
import SignIn from './SignIn.jsx';
import axios from 'axios';
import AllCard from '../crousal/all_card.jsx';

function FirstPage() {

  const [signup, showsignup] = useState(false);
  const [signin, showsignin] = useState(false);
  const [allUserMemory, setAllUserMemory] = useState([]);

  const handlesignup = () => {
    showsignup(false);
  }

  const handlesignin = () => {
    showsignin(false);
  }

  const allMemory = async () => {
    try {
      const response = await axios.post('/api/v1/upload/allMemory');
      console.log(response.data)
      const sortedImages = response.data.data.sort((a, b) => {
        // Convert uploadTime to Date objects
        const dateA = new Date(a.uploadTime);
        const dateB = new Date(b.uploadTime);
        // Compare the dates
        return dateB - dateA; // Latest dates first
      });
      setAllUserMemory(sortedImages);
      // console.log(sortedImages);
    } catch (error) {
      console.error("Error All Memory", error);
    }
  }

  useEffect(() => {
    allMemory();
  }, []);

  return (
    <>
      <div>

        {/* Navigation */}
        <div>
          <div className='flex border-4 border-slate-200 justify-between font-semibold bg-indigo-500'>
            <div className='flex p-2 ml-14'>
              <div className='m-2 text-xl cursor-pointer text-violet-950'>Home</div>
              <div className='m-2 ml-10 text-xl cursor-pointer text-violet-950'>Memories</div>
              <div className='m-2 ml-10 text-xl cursor-pointer text-violet-950'>Contact Us</div>
            </div>
            <div className='flex p-2 mr-10'>
              <button className='text-xl mr-8 border-2 p-2 rounded-md bg-blue-500 
              hover:bg-blue-700 active:bg-blue-800 text-violet-950'
                onClick={() => showsignin(true)}>
                Log In
              </button>
              {signin && <div className='fixed inset-0 z-40 bg-white transition-opacity duration-300'>
                <SignIn close={handlesignin} /></div>}


              <button className='text-xl border-2 p-2 rounded-md bg-violet-500 
              hover:bg-violet-700 active:bg-violet-800 text-violet-950'
                onClick={() => showsignup(true)}>
                Get Started
              </button>
              {signup && <div className='fixed inset-0 z-40 bg-white transition-opacity duration-300'>
                <UserRegistration close={handlesignup} /></div>}
            </div>
          </div>
        </div>

        <div>
          <div className='text-center p-16 border-2 bg-indigo-200'>
            <div className='text-7xl font-bold p-2 text-fuchsia-700'>
              Memory Cloud
            </div>
            <div className='text-5xl font-semibold p-4 text-violet-700'>
              Memory For All
            </div>
            <div className='text-xl font-medium mt-16 p-2 text-fuchsia-700'>
              Anyone can Upload Your Memory And Watch Other Memory
            </div>
            <button className='text-xl font-semibold p-2 rounded-md mr-8 bg-blue-400
            hover:bg-blue-500 active:bg-blue-800 text-slate-800'
              onClick={() => showsignup(true)}>
              Upload Your Memory
            </button>
            {signup && <div className='fixed inset-0 z-40 bg-white transition-opacity duration-300'>
              <UserRegistration close={handlesignup} /></div>}

            <button className='text-xl font-semibold p-2 rounded-md bg-violet-400
            hover:bg-violet-500 active:bg-violet-800 text-slate-800'>
              Watch Other Memory
            </button>

          </div>
        </div>


        <div className=''>

          <div className="bg-indigo-300 h-[550px] overflow-y-auto">
            <div className='flex justify-center my-5 font-bold text-xl'>
              <div className='p-3 rounded-md bg-violet-500 text-violet-950'>
                All User Memory
              </div>
              
            </div>
            <div className="grid grid-cols-3 gap-4 mx-5">
              {allUserMemory.map((image, index) => (
                <AllCard
                  key={index}
                  username={image.username}
                  images={`data:${image.memoryImage.contentType};base64,${image.memoryImage.data}`}
                  description={image.description}
                  topic={image.topic}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default FirstPage