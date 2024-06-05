import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';

function comment({ closeComment, imgid }) {
    const [comments, setComments] = useState([]);
    const [userComments, setuserComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editMode, setEditMode] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);

    // const handleCommentSubmit = (event) => {
    //     event.preventDefault();
    //     const username = 'User'; // Replace with dynamic username if available
    //     if (newComment.trim()) {
    //         if (editingIndex !== null) {
    //             const updatedComments = [...comments];
    //             updatedComments[editingIndex] = { username, text: newComment };
    //             setComments(updatedComments);
    //             setEditingIndex(null);
    //         } else {
    //             setComments([{ username, text: newComment }, ...comments]);
    //         }
    //         setNewComment('');
    //     }
    // };

    // const handleCommentSubmit = async (event) => {
    //     event.preventDefault();
    //     const username = 'User'; // Replace with dynamic username if available
    //     if (newComment.trim()) {
    //         if (editingIndex !== null) {
    //             const updatedComments = [...comments];
    //             updatedComments[editingIndex] = { username, text: newComment };
    //             setComments(updatedComments);
    //             setEditingIndex(null);
    //             setNewComment(''); // Reset the textarea content after update
    //         } else {
    //             try {
    //                 const response = await axios.post(`/api/v1/allComments/userComment/${imgid}`,
    //                     {
    //                         comment: newComment
    //                     }); // Send comment to backend

    //                 // const { commentId, newComment } = response.data;
    //                 setComments([{ username, text: newComment }, ...comments]);
    //                 setNewComment('');
    //                 console.log(response.data)

    //             } catch (error) {
    //                 console.error("Error saving comment:", error);
    //                 // Handle error
    //             }
    //         }
    //     }
    // };
    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        // const username = 'User'; // Replace with dynamic username if available
        if (newComment.trim()) {
            try {
                const response = await axios.post(`/api/v1/allComments/userComment/${imgid}`,
                    {
                        comment: newComment
                    }); // Send comment to backend

                // const { commentId, newComment } = response.data;
                // setComments([{ username, text: newComment }, ...comments]);
                setNewComment('');
                // console.log(response.data)
                commentRetrieve();

            } catch (error) {
                console.error("Error saving comment:", error);
                // Handle error
            }
        }
    };

    const handleCommentEditSubmit = async (commentid) => {
        // event.preventDefault();
        // const username = 'User'; // Replace with dynamic username if available
        if (newComment.trim()) {
            if (editingIndex !== null) {
                const updatedComments = [...comments];
                updatedComments[editingIndex] = {text: newComment };
                // setComments(updatedComments);
                setEditingIndex(null);
                setNewComment(''); // Reset the textarea content after update

                try {
                    // Send the comment ID along with the updated comment to the backend
                    await axios.post(`/api/v1/allComments/userEditComment/${commentid}`, {
                        newcomment: newComment 
                    });
                    commentRetrieve();
                } catch (error) {
                    console.error("Error updating comment:", error);
                    // Handle error
                }
            }
        }
    };

    const handleCommentDelete = async (commentid) => {
        const response = await axios.post(`/api/v1/allComments/userDeleteComment/${commentid}`);
        // console.log(response);
        commentRetrieve();
    }


    const commentRetrieve = async () => {
        try {
            const response = await axios.post(`/api/v1/allComments/userCommentRetrieve/${imgid}`);
            setuserComments(response.data.message);
            // console.log(response.data.message)
        } catch (error) {
            console.log("Comment Retrieve:", error);
        }

    }

    useEffect(() => {
        commentRetrieve();
    }, [])


    return (
        <>
            <div className='relative'>
                <div className='absolute flex flex-reverse top-[50px] right-[150px] text-red bg-gray-50 rounded-full px-5 py-3
                cursor-pointer hover:bg-red-500 active:bg-red-700'
                    onClick={closeComment}
                >X</div>
            </div>
            <div >

                <div className="flex flex-col mx-52 my-20 bg-white">
                    <header className="bg-gray-800 text-white p-4 text-center">
                        <h1>Comment Section</h1>
                    </header>
                    <div className="flex-grow overflow-auto p-4 bg-gray-100 h-80 overflow-y-auto ">
                        {/* <div className="space-y-4 mb-5">
                            {comments.map((comment, index) => (
                                <div key={index} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{comment.username}</p>
                                        <p>{comment.text}</p>
                                    </div>

                                    {editMode && (<div className='flex space-x-4'>
                                        <button
                                            onClick={() => {
                                                setEditingIndex(index);
                                                setNewComment(comment.text);
                                                setNewComment('');
                                                setEditMode(false);
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"

                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setComments(comments.filter((_, i) => i !== index))}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>)}

                                </div>
                            ))}
                        </div> */}

                        {/* userComment */}
                        <div className="space-y-4">
                            {userComments && userComments.map((comment, index) => (
                                <div key={index} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{comment.users.username}</p>
                                        <p>{comment.userWriteComment}</p>
                                    </div>

                                    {editMode && (<div className='flex space-x-4'>
                                        <button
                                            onClick={() => {
                                                setEditingIndex(index);
                                                setNewComment(comment.text);
                                                setEditingCommentId(comment._id);
                                                setNewComment('');
                                                setEditMode(false);
                                            }}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"

                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setComments(comments.filter((_, i) => i !== index));
                                                handleCommentDelete(comment._id);
                                            }}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>)}

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-800 text-white p-4 text-center">
                        <form
                            // onSubmit={handleCommentSubmit} 
                            className="flex flex-col space-y-2">
                            <textarea
                                className="p-2 border border-gray-300 rounded text-black"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            />

                            <button
                                type="button"
                            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {editingIndex !== null ?
                                    <div className={`${newComment.trim() ?
                                        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' :
                                        'bg-blue-200 text-gray-400 cursor-not-allowed font-bold py-2 px-4 rounded'
                                        }`}
                                        onClick={() => {
                                            setEditMode(true);
                                            handleCommentEditSubmit(editingCommentId);
                                        }}
                                        disabled={!newComment.trim()}>
                                        'Update Comment'</div>
                                    :
                                    <div className={`${newComment.trim() ?
                                        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' :
                                        'bg-blue-200 text-gray-400 cursor-not-allowed font-bold py-2 px-4 rounded'
                                        }`}
                                        disabled={!newComment.trim()}
                                        onClick={handleCommentSubmit}
                                    > Post Comment</div>
                                }
                            </button>

                            <button
                                type="button" // Change to "button" to prevent form submission
                                // className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    setNewComment('');
                                    setEditMode(true);
                                    setEditingIndex(null);
                                }}

                            >
                                {editingIndex !== null ?
                                    <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >Cancel Update</div>
                                    :
                                    <div className={`${newComment.trim() ?
                                        'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' :
                                        'bg-red-200 text-gray-400 cursor-not-allowed font-bold py-2 px-4 rounded'
                                        }`}
                                        disabled={!newComment.trim()}>Cancel Comment</div>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </>

    );
}

export default comment