import React, { useEffect } from 'react'
import { useState } from 'react'
import Person_account_image from '../images/Person_account_image.png'
import UploadContainer from '../upload/upload.jsx'
import YourCard from '../crousal/your_card.jsx';
import OtherCard from '../crousal/other_card.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function UserPage() {

  const [uploadCon, useUploadCon] = useState(false);
  const [userPageCon, useUserPageCon] = useState(true);
  const [images, setImages] = useState([]);
  const [allimages, setAllImages] = useState([]);
  const [likeImage, setLikeImage] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMemoryType, setSelectedMemoryType] = useState('Your Memory');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/v1/upload/yourMemory');
        // Sort the images based on their upload time
        // console.log(response.data.data);
        const sortedImages = response.data.data.sort((a, b) => {
          // Convert uploadTime to Date objects
          const dateA = new Date(a.uploadTime);
          const dateB = new Date(b.uploadTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        setImages(sortedImages);
        // console.log(sortedImages);

        // setImages(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchData();
  }, []);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post('/api/v1/upload/otherMemory');
        // Sort the images based on their upload time
        const sortedImages = response.data.data.sort((a, b) => {
          // Convert uploadTime to Date objects
          const dateA = new Date(a.uploadTime);
          const dateB = new Date(b.uploadTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        setAllImages(sortedImages);
        // console.log(sortedImages);

        // setImages(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLikedImages() {
      try {
        const response = await axios.post('/api/v1/likes/getImage');
        if (response.data.success) {
          const images = response.data.message;
          // Update liked images state
          setLikeImage(images);
        } else {
          console.error('Error fetching liked images:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching liked images:', error);
      }
    }

    if (selectedMemoryType === 'Likes Memory') {
      // Fetch liked images when selectedMemoryType is 'Likes Memory'
      fetchLikedImages();
    }
  }, [selectedMemoryType]);

  const handleUploadCon = () => {
    useUploadCon(true);
    useUserPageCon(false);
  }

  const closeUploadContainer = () => {
    useUploadCon(false);
    useUserPageCon(true);
  }

  // Define a function to format the upload time
  const formatUploadTime = (uploadTime) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(uploadTime).toLocaleDateString('en-IN', options);
  };

  const addNewImage = (newImage) => {
    setImages([...images, newImage]);
  };

  // Group images by upload date
  const groupedImages = images.reduce((groups, image) => {
    const uploadDate = formatUploadTime(image.uploadTime);
    if (!groups[uploadDate]) {
      groups[uploadDate] = [];
    }
    groups[uploadDate].push(image);
    return groups;
  }, {});

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Scroll to the top of the container when a date is selected
    const container = document.querySelector('.cardTop');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const filteredImages = selectedDate
    ? groupedImages[selectedDate]
    : images;

  const handleMemoryTypeClick = (memoryType) => {
    setSelectedMemoryType(memoryType);
  };

  const logOut = async(req, res) => {
    try {
      const response = await axios.post('/api/v1/users/logout')
      console.log(response.data);
      navigate('/');
      alert("Successfully LogOut");
      
    } catch (error) {
      console.log("Logout error:", error)
      console.error("Error", error)
    }
  }

  const userAccountDelete = async(req, res) => {
    try {
      const response = await axios.post('/api/v1/users/userDelete')
      console.log(response.data);
      navigate('/');
      alert("Successfully Account Deleted")
    } catch (error) {
      console.log("Logout error:", error)
      console.error("Error", error)
    }
  }

  return (
    <>
      {userPageCon &&
        (<div>
          {/* Navigation */}
          <div className='flex bg-indigo-700 border-slate-300 border-4 p-4 justify-between px-12'>
            <div className='flex'>
              <input className='rounded-md w-52 h-10 p-4 focus:outline-none focus:ring focus:border-blue-600' type="text"
                placeholder='Search...' />
              <button className='flex ml-4 rounded-md w-20 h-10 bg-slate-300 items-center justify-center font-semibold
            hover:bg-slate-400 active:bg-slate-500'>
                Search
              </button>
            </div>

            <div className='flex space-x-5'>
              <div className='flex rounded-md bg-blue-500 justify-center items-center px-2 cursor-pointer border-2 border-stone-300
              hover:bg-blue-700 active:bg-blue-800 text-xl font-semibold'
              onClick={logOut}>
                Log Out
              </div>
              <div className='flex rounded-md bg-red-500 justify-center items-center px-2 cursor-pointer border-2 border-stone-500
              hover:bg-red-700 active:bg-red-800 text-xl font-semibold'
              onClick={userAccountDelete}
              >
                Delete Account
              </div>
            </div>

          </div>


          <div>
            <div className='flex justify-center py-4 bg-sky-100'>
              <button className='text-xl font-semibold border-2 p-2 rounded-md mr-8 border-stone-300 bg-sky-400
            hover:bg-sky-500 active:bg-sky-800'
                onClick={handleUploadCon}
              >Upload Your Memory</button>
            </div>

            <div className='bg-sky-100'>
              <div className='flex mx-5 pb-5 space-x-3'>

                <div className={`rounded-full w-full text-center text-xl font-semibold py-2 bg-indigo-200
            cursor-pointer ${selectedMemoryType === 'Your Memory' ? 'bg-indigo-500' : 'hover:bg-indigo-300'}`}
                  onClick={() => handleMemoryTypeClick('Your Memory')}>Your Memory</div>

                <div className={`rounded-full w-full text-center text-xl font-semibold py-2 bg-indigo-200
              cursor-pointer ${selectedMemoryType === 'Other Memory' ? 'bg-indigo-500' : 'hover:bg-indigo-300'}`}
                  onClick={() => handleMemoryTypeClick('Other Memory')}>Other Memory</div>

                <div className={`rounded-full w-full text-center text-xl font-semibold py-2 bg-indigo-200
              cursor-pointer ${selectedMemoryType === 'Likes Memory' ? 'bg-indigo-500' : 'hover:bg-indigo-300'}`}
                  onClick={() => handleMemoryTypeClick('Likes Memory')}>Likes Memory</div>

              </div>

            </div>


            {/* YourMemory */}
            {selectedMemoryType === 'Your Memory' && (
              <div className="cardTop bg-indigo-300 h-[550px] overflow-y-auto relative">
                <div className='sticky top-0 '>
                  {/* UploadDate */}
                  <div className='mb-3 p-3 bg-slate-200'>
                    <div className='flex bg-white space-x-5 items-center px-3 py-1 w-auto rounded-md border-slate-200 border-2'>
                      <div className='font-semibold'>
                        Select Date
                      </div>
                      <select
                        className='border border-gray-300 rounded-md py-2 px-3 text-base leading-normal 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        onChange={(e) => handleDateChange(e.target.value)}
                      >
                        <option value="">All Dates</option>
                        {Object.keys(groupedImages).map((date, index) => (
                          <option key={index} value={date}>{date}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>


                {selectedDate === "" ? (
                  Object.entries(groupedImages).map(([date, imagesInGroup], index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 mx-5">
                      {imagesInGroup.map((image, index) => (
                        <YourCard
                          key={index}
                          images={`data:${image.memoryImage.contentType};base64,${image.memoryImage.data}`}
                          description={image.description}
                          topic={image.topic}
                          uploadDate={formatUploadTime(image.uploadTime)}
                          id={image._id}
                        />
                      ))}
                    </div>
                  ))
                ) 
                : (
                  // UserSelectedDate
                  <div className="grid grid-cols-3 gap-4 mx-5">
                    {filteredImages.map((image, index) => (
                      <YourCard
                        key={index}
                        images={`data:${image.memoryImage.contentType};base64,${image.memoryImage.data}`}
                        description={image.description}
                        topic={image.topic}
                        uploadDate={formatUploadTime(image.uploadTime)}
                        id={image._id}
                      />
                    ))}
                  </div>
                )
              }
              </div>
            )}



            {/* OtherMemory */}
            {selectedMemoryType === 'Other Memory' && (
              <div className="bg-indigo-300 h-[550px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 mx-5">
                  {allimages.map((image, index) => (
                    <OtherCard
                      key={index}
                      username={image.username}
                      images={`data:${image.memoryImage.contentType};base64,${image.memoryImage.data}`}
                      description={image.description}
                      topic={image.topic}
                      uploadDate={formatUploadTime(image.uploadTime)}
                      imgid={image._id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LikesMemory */}
            {selectedMemoryType === 'Likes Memory' && (
              <div className="bg-indigo-300 h-[550px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 mx-5">
                  {likeImage.map((image, index) => (
                    <OtherCard
                      key={index}
                      username={image.username}
                      images={`data:${image.memoryImage.contentType};base64,${image.memoryImage.data}`}
                      description={image.description}
                      topic={image.topic}
                      uploadDate={formatUploadTime(image.uploadTime)}
                      imgid={image._id}
                    />
                  ))}
                </div>
              </div>
            )}



          </div>
        </div>)}

      {uploadCon && (
        <div>
          <UploadContainer closeContainer={closeUploadContainer} addNewImage={addNewImage} />
          <div
            className='absolute top-[20px] end-[570px] cursor-pointer'
            onClick={closeUploadContainer}>X</div>
        </div>
      )}

    </>
  )
}

export default UserPage