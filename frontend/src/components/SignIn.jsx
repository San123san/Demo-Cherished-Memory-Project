import React, { useState } from 'react'
import UserRegistration from './UserRegistration'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn({ close }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usersignup, showusersignup] = useState(false);
  const [usersignin, showusersignin] = useState(true);
  const navigate = useNavigate();

  const handleusersignup = () => {
    showusersignup(true);
    showusersignin(false);
  }

  const handleSignIn = async(e) => {
    e.preventDefault();

    try{
      const response = await axios.post('/api/v1/users/login', {email, password});

      if(response.status === 200) {
        navigate('/UserPage');
      }
    } catch (error) {
      console.log('Error:', error.response.data); // Add this line for debugging
      if(error.response.status === 400 || error.response.status===404){
        alert("Check Your Credential")
      }
    }
  };

  return (
    <>
      {usersignin &&
        <div>
          <form>
            <div className='flex flex-col mt-24 items-center h-screen '>
              <div className=''>
                <div className='text-center'>
                  <div className='font-bold text-[33px]'>
                    Sign In
                  </div>
                  <div>
                    <span className='text-gray-500'>Already Account? </span>
                    <button className='font-semibold'
                      onClick={handleusersignup}>
                      Sign Up
                    </button>

                  </div>
                </div>
                <div className='flex flex-col'>

                  {/* Email */}
                  <div className='my-4'>
                    <input
                      className='rounded-md border-2 p-[5px] w-[25rem] border-slate-400'
                      type="text"
                      placeholder='Email' 
                      value = {email} 
                      onChange={(e) => setEmail(e.target.value)}/>
                      
                  </div>

                  {/* Password */}
                  <div className='my-4'>
                    <input
                      className='rounded-md border-2 p-[5px] w-[25rem] border-slate-400'
                      type="text"
                      placeholder='Password' 
                      value = {password} 
                      onChange={(e) => setPassword(e.target.value)}/> 
                  </div>
                </div>


                <div className='flex flex-col'>
                  <button className='bg-slate-400 rounded-lg my-4 p-2 font-semibold
              hover:bg-slate-500 active:bg-slate-700'
              onClick={handleSignIn}>
                    Sign In
                  </button>
                  <button className='bg-red-400 rounded-lg p-2 font-semibold
              hover:bg-red-500 active:bg-red-700'
                    onClick={close}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
      {usersignup && <UserRegistration onClick={close} />}
    </>
  )
}

export default SignIn