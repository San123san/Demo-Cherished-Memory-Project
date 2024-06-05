import React, { useState } from 'react';
import user_image from '../images/Person_account_image.png'
import axios from 'axios'

function Upload({closeContainer, addNewImage}) {
    const [selectedImage, setSelectedImage] = useState(user_image);
    const [showImage, setShowImage] = useState(user_image);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    const handleImageUpload = (event) => {
        setShowImage(URL.createObjectURL(event.target.files[0]));
        setSelectedImage(event.target.files[0]);
    };

    const maxCharacters = 150;
    const handleChange = (event) => {
        const newValue = event.target.value;
        const totalCharacters = newValue.length;

        if (totalCharacters <= maxCharacters) {
            setDescription(newValue);
        }
    };

    const charactersLeft = maxCharacters - description.length;

    const handleSubmit = async () => {
        try{
            const formData = new FormData();
            formData.append('memoryImage', selectedImage);
            formData.append('description', description);
            formData.append('topic', topic);

            const response = await axios.post('/api/v1/upload/memoryUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            addNewImage(response.data.data); // Call the callback function
            closeContainer();
            console.log(response.data);
            
        } catch (error){
            console.log('error:',error.response.data)
        }
    }

    return (
        <>
            <div className='flex flex-col items-center p-5 h-screen bg-slate-100'>
                <div className='flex flex-row-reverse ml-96'>X</div>
                <div>
                    <div className='w-80 h-80 border-2 border-black'>
                        <img className='w-full h-full object-contain bg-white' src={showImage} alt="" />
                    </div>
                    <div className='text-center m-4'>
                        <input type="file" onChange={handleImageUpload} className='hidden' id="fileUpload" />
                        <label htmlFor="fileUpload" className='bg-orange-500 rounded-lg py-2 px-4 cursor-pointer 
                        hover:bg-orange-600 active:bg-orange-700'>
                            Upload Photo</label>
                    </div>
                </div>

                <div className='p-5 '>
                    <input className='p-3 border-slate-300 border-2 rounded-lg outline-none'
                        type="text" placeholder='Enter Topic Here' 
                        onChange={(e)=>setTopic(e.target.value)}/>
                </div>

                <div className='p-5 flex flex-col'>
                    <textarea className='p-3 border-slate-300 border-2 rounded-lg outline-none resize-none'
                        rows={3} cols={50} value={description} onChange={handleChange} placeholder='Enter Description Here' />
                    <div className='text-xs'>Characters Left: {charactersLeft}</div>
                </div>

                <button className='p-2 px-5 bg-slate-300 border-3 border-slate-300 rounded text-black hover:bg-slate-500
                active:bg-slate-700 font-semibold'
                onClick={handleSubmit}>
                    Submit</button>
            </div>
        </>
    )
}

export default Upload