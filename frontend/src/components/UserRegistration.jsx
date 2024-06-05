import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import axios from 'axios';

function UserRegistration({ close }) {

  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, email, password);

    let errors = { username: '', email: '', password: '' };

    if (!username) {
      errors = { ...errors, username: 'Please fill UserName' };
    }
    if (!isValidEmail(email)) {
      errors = { ...errors, email: 'Please enter a valid email address' };
    }
    if (!password) {
      errors = { ...errors, password: 'Please enter a password' };
    }

    setErrors(errors);

    if (username && isValidEmail(email) && password) {
      try {
        const response = await axios.post('/api/v1/users/register', {
          username,
          email,
          password
        })
        console.log(response.data);
        navigate('/UserPage');
      } catch (error) {
        console.log(error.response);
        console.log(error.response.status);
        // Parse the HTML response to extract the error message
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(error.response.data, 'text/html');
        const errorMessage = htmlDocument.querySelector('pre').textContent.trim();

        // Now, you can use the extracted error message for handling errors
        console.log(errorMessage);

        if (errorMessage.includes("User with username or email already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            username: 'Username Already Exist',
            email: 'Email Already Exist'
          })
        }
        if (errorMessage.includes("User with username already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            username: 'Username Already Exist',
          })
        }
        if (errorMessage.includes("User with email already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            email: 'Email Already Exist'
          })
        }
      }
    }
  }

  const cancel = () => {
    close
  }

  const [signup, showsignup] = useState(true);
  const [signin, showsignin] = useState(false);

  const handleusersignin = () => {
    showsignup(false);
    showsignin(true);
  }


  return (
    <>
      {signup &&
        <div>
          <form>
            <div className='flex flex-col mt-24 items-center h-screen '>
              <div className=''>
                <div className='text-center'>
                  <div className='font-bold text-[33px]'>
                    Sign UP
                  </div>
                  <div>
                    <span className='text-gray-500'>Already Account? </span><button className='font-semibold'
                      onClick={handleusersignin}>
                      Sign In</button>

                  </div>
                </div>
                <div className='flex flex-col'>

                  {/* UserName */}
                  <div className='my-4'>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setusername(e.target.value);
                        // Clear the error message for name in state
                        setErrors({ ...errors, username: '' });
                      }}
                      className={`rounded-md border-2 p-[5px] w-[25rem] ${errors.username ? 'border-red-500' : 'border-slate-400'
                        }`}
                      placeholder='UserName' />
                    {errors.username && <p className="text-red-500 absolute">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div className='my-4'>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setemail(e.target.value);
                        // Clear the error message for name in state
                        setErrors({ ...errors, email: '' });
                      }}
                      className={`rounded-md border-2 p-[5px] w-[25rem] ${errors.email ? 'border-red-500' : 'border-slate-400'
                        }`}
                      placeholder='Email' />
                    {errors.email && <p className="text-red-500 absolute">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className='my-4'>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                        // Clear the error message for name in state
                        setErrors({ ...errors, password: '' });
                      }}
                      className={`rounded-md border-2 p-[5px] w-[25rem] ${errors.password ? 'border-red-500' : 'border-slate-400'
                        }`}
                      placeholder='Password' />
                    {errors.password && <p className="text-red-500 absolute">{errors.password}</p>}
                  </div>
                </div>


                <div className='flex flex-col'>
                  <button className='bg-slate-400 rounded-lg my-4 p-2 font-semibold
                hover:bg-slate-500 active:bg-slate-700'
                    onClick={handleSubmit} >
                    Sign Up
                  </button>
                  <button className='bg-red-400 rounded-lg p-2 font-semibold
                hover:bg-red-500 active:bg-red-700'
                    onClick={cancel}>
                    Cancel</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
      {signin && <SignIn onClick={cancel} />}

    </>
  )
}

export default UserRegistration