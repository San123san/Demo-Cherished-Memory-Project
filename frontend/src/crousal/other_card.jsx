import React from 'react'
import { useState, useEffect } from 'react'
import thumbDown from '../images/thumbDown.png'
import thumbUp from '../images/thumbUp.png'
import axios from 'axios'
import CommnetPage from '../comment/comment'

function other_card({ username, images, topic, description, uploadDate, imgid }) {

  // const [thumbState, setThumbState] = useState('thumbDown'); // State to track thumb state
  const [isLiked, setIsLiked] = useState(false);
  // const [ likeStatus, setLikeStatus] = useState(false);
  const [userComment, showUserComment] = useState(false);

  const toggleLike = async () => {
    try {
      const response = await axios.post(`/api/v1/likes/likeAndUnlike/${imgid}`);
      // console.log(response.data);
      if (response.data.success) {
        setIsLiked(!isLiked); // Toggle the liked state
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleStatus = async () => {
    try {
      const response = await axios.post(`/api/v1/likes/getImage/${imgid}`);
      // console.log(response.data);
      if (response.data.statusCode === true) {
        // setLikeStatus(true);
        setIsLiked(true);
      } else {
        // setLikeStatus(false);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    toggleStatus();
  }, []);

  const handleClickCloseComment = () => {
    showUserComment(false);
  }

  return (
    <>
      <div className='p-5'>
        <div className='rounded-md p-3 px-10 pb-5 bg-white hover:shadow-2xl'>


          <div className='flex pb-5 justify-around border-b-2 place-items-center'>
            <div className='flex space-x-5 place-items-center'>
              <div className='border-2 px-2 py-1 font-medium text-xl rounded-md'>{username}</div>
              <div className='border-2 rounded-md px-2 py-1 cursor-pointer'
                onClick={() => showUserComment(true)}>Comment</div>
            </div>
            {userComment && <div className='fixed inset-0 z-40 duration-300 backdrop-blur-md'>
              <CommnetPage closeComment={handleClickCloseComment} imgid={imgid} />
            </div>}
            <div className='flex place-items-center space-x-5'>
              <div className='w-[35px] h-[35px] cursor-pointer p-1 rounded-md 
              hover:bg-slate-200'onClick={toggleLike}>
                <img src={isLiked ? thumbUp : thumbDown} alt="" /></div>
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

export default other_card