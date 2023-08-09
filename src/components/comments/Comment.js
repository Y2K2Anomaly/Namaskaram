import React, { useEffect, useState } from 'react';
import './comment.css';
import axios from 'axios';
import { Delete } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';

const Comment = React.memo(({ currentUser, post, comments, setComments }) => {
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllUsers = async () => {
            const res = await axios.get('/users/all')
            setAllUsers(res.data)
        }
        getAllUsers();
    }, [])

    const [commentText, setCommentText] = useState("");
    const postHandler = async () => {
        try {
            if (commentText !== '') {

                const newComment = {
                    userId: currentUser._id,
                    postId: post._id,
                    text: commentText,
                };
                const response = await axios.post("/post/comments", newComment);
                setComments((prevComments) => [...prevComments, response.data]);
                setCommentText("");
                console.log("Comment added successfully!", response.data);
            }


        } catch (err) {
            console.error("Error posting comment: ", err)
        }
    }

    const deleteHandler = async ({ commentId }) => {
        console.log(commentId)
        try {
            await axios.delete(`/post/comments/delete/${commentId}`, {
                data: { userId: currentUser._id },
            })
            setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId))
            console.log("deleted successfully")
        } catch (err) {
            console.error("Error while deleting comments: ", err)
        }
    }

    return (
        <>
            <div className='commentContainer'>
                <div className='commentWrapper'>
                    <div className="commentInputWrapper">
                        <input type="text" className='commentInput' placeholder='comment...' value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                        <button className='commentInputButton' onClick={postHandler}>Post</button>
                    </div>
                    <h3>Comments: {comments.length}</h3>

                    {comments.length === 0 ? "" :
                        comments?.map(comment => (
                            <div className="comment" key={comment._id}>

                                {allUsers?.map(user => (
                                    user._id === comment.userId && (
                                        <div className='namePictureComment' key={comment._id}>
                                            <IconButton onClick={() => navigate(`/profile/${user.username}`)}>
                                                <img src={user.profilePicture.url || "/assets/noAvatar.png"} alt="" className='commentImg' />
                                            </IconButton>
                                            <h5 onClick={() => navigate(`/profile/${user.username}`)}>{user.username}</h5>
                                            <span className='userComment'>{comment.text}</span>
                                        </div>
                                    )
                                )
                                )}
                                {currentUser._id === comment.userId &&
                                    <IconButton onClick={() => deleteHandler({ commentId: comment._id })}>
                                        <Delete sx={{ color: "red" }} />
                                    </IconButton>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
})

export default Comment