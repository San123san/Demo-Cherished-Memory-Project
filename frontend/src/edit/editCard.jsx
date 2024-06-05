import React from 'react'
import { useState } from 'react';
import axios from 'axios'

function editCard({editClose, initialTopic, initialDescription, initialImage, id}) {
    const [selectedImage, setSelectedImage] = useState(initialImage);
    const [showImage, setShowImage] = useState(initialImage);
    const [topic, setTopic] = useState(initialTopic);
    const [description, setDescription] = useState(initialDescription);

    const handleImageUpload = (event) => {
        setShowImage(URL.createObjectURL(event.target.files[0]));
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        try{
            const formData = new FormData();
            formData.append('memoryImage', selectedImage);
            formData.append('description', description);
            formData.append('topic', topic);

            const response = await axios.post(`/api/v1/upload/memoryEdit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log(response.data);
            editClose();
            // Reload the page after 5 seconds
        setTimeout(() => {
            window.location.reload();
        }, 100);
        } catch (error){
            console.log('error:',error.response.data)
        }
    }

    const maxCharacters = 150;
    const handleChange = (event) => {
        const newValue = event.target.value;
        const totalCharacters = newValue.length;

        if (totalCharacters <= maxCharacters) {
            setDescription(newValue);
        }
    };

    const charactersLeft = maxCharacters - description.length;

    return (
        <>
            <div className='flex flex-col items-center p-5 h-screen bg-slate-100 '>
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
                        type="text" placeholder='Enter Topic' value={topic} // Set value to display initial value
                        onChange={(e) => setTopic(e.target.value)} // Update topic state
                        />
                </div>

                <div className='p-5 flex flex-col'>
                    <textarea className='p-3 border-slate-300 border-2 rounded-lg outline-none resize-none'
                        rows={3} cols={50} value={description} onChange={handleChange} placeholder='Enter Description' />
                    <div className='text-xs'>Characters Left: {charactersLeft}</div>
                </div>

                <div className='flex space-x-3'>
                    <button className='p-2 px-5 bg-slate-300 border-3 border-slate-300 rounded text-black hover:bg-slate-500
                active:bg-slate-700 font-semibold'
                onClick={handleSubmit}>
                    Submit</button>

                    <button className='p-2 px-5 bg-red-300 border-3 border-red-300 rounded text-black hover:bg-red-500
                active:bg-red-700 font-semibold'
                onClick={editClose}
                >
                    Cancel</button>
                </div>
                
            </div>
        </>
    )
}

export default editCard