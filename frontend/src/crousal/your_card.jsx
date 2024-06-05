import React, { useState, useEffect } from 'react'
import EditCa from '../edit/editCard.jsx'
import axios from 'axios';
import CommnetPage from '../comment/comment'

function your_card({ images, topic, description, uploadDate, id }) {

  const [editC, useEditC] = useState(false);
  const [userComment, showUserComment] = useState(false);
  const [ImageLike, setTotalImageLike] = useState();
  const handleClose = () => {
    useEditC(false);
  }

  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageError = () => {
    setImageLoadError(true);
  };

  useEffect(() => {
    let refreshInterval;

    if (imageLoadError) {
      // Reload the card after 5 seconds if an image loading error occurs
      refreshInterval = setInterval(() => {
        window.location.reload();
      }, 5000);
    }

    return () => clearInterval(refreshInterval);
  }, [imageLoadError]);


  const handleDelete = async () => {
    try {
      // Send a POST request to the backend route with the card ID
      const response = await axios.post(`/api/v1/upload/memoryDelete/${id}`);
      // Check if the delete was successful
      if (response.status === 200) {
        // You may want to handle success, e.g., show a message or update UI
        console.log('Delete successful');
      }
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      // Handle error, e.g., show error message to the user
      console.error('Error deleting card:', error);
    }
  };

  useEffect(() => {
    const totalImageLike = async () => {
      try {
        const response = await axios.post(`/api/v1/likes/totalLike/${id}`)
        // console.log(response.data);
        const like = response.data.message.totalLikes;
        setTotalImageLike(like);
      } catch (error) {
        console.log("Error totalImageLike: ", error);
      }
    }
    totalImageLike();
  }, [])

  const handleClickCloseYourCardComment = () => {
    showUserComment(false);
  }

  return (
    <>
      <div className='p-5 font-bold '>
        <div className=' rounded-md p-3 px-10 pb-5 bg-white hover:shadow-2xl'>

          <div className='flex pb-5 justify-around border-b-2 place-items-center drop-shadow-md'>
            <div className='flex space-x-3 place-items-center'>

              <div className='border-2 rounded-md px-2 py-1 cursor-pointer'
                onClick={() => showUserComment(true)}
              >Comment</div>


              <div className='border-2 rounded-md px-2 py-1'>Likes: {ImageLike}</div>
            </div>

            <div className='flex place-items-center space-x-3'>
              <div className='border-2 rounded-md px-3 bg-blue-500 py-1 cursor-pointer
              hover:bg-blue-600 active:bg-blue-700'
                onClick={() => useEditC(true)}>Edit</div>

              <div className='border-2 rounded-md px-3 bg-red-400 py-1 cursor-pointer
              hover:bg-red-500 active:bg-red-600' onClick={handleDelete}>Delete</div>
            </div>

          </div>
          {userComment && <div className='fixed inset-0 z-40 duration-300 backdrop-blur-md'>
            <CommnetPage closeComment={handleClickCloseYourCardComment} imgid={id} />
          </div>}

          <div className='flex  pt-3'>
            <div>
              {imageLoadError ? (
                <div className='w-60 h-60 bg-gray-200 flex items-center justify-center text-red-500'>
                  Error loading image. This card will refresh in 5 seconds.
                </div>
              ) : (
                <img
                  className='object-contain bg-white w-60 h-60 border-2 rounded-md'
                  src={images}
                  alt=''
                  onError={handleImageError}
                />
              )}
              <div className='mt-3'>Upload Date: {uploadDate}</div>
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

      {editC && (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-white p-10 rounded-md'>
            <EditCa editClose={handleClose}
              initialTopic={topic}
              initialDescription={description}
              initialImage={images}
              id={id}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default your_card