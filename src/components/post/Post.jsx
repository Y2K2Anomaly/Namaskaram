import React, { useContext, useEffect, useRef, useState } from 'react';
import './post.css';
import { MoreVert, FavoriteBorder, Favorite, ChatBubbleOutline } from "@mui/icons-material";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { AuthContext } from '../../context/AuthContext';
import { IconButton } from '@mui/material';
import Comment from '../comments/Comment';

const Post = ({ post, onDelete, onEdit }) => {
    const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0); // Handled undefined likes array
    const [comments, setComments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [like, setLike] = useState(false);
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setLike(post.likes?.includes(currentUser._id) ?? false); // Handle undefined likes array
    }, [currentUser._id, post.likes]);

    useEffect(() => {
        const getComments = async () => {

            try {
                const res = await axios.get(`/post/comments/${post._id}`)
                setComments(res.data)
            } catch (err) {
                console.error(err);
            }
        }

        getComments()
    }, [post])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [post.userId]);

    const likeHandler = () => {
        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) {
            console.log(err);
        }
        if (!like) {
            setLike(true);
            setLikeCount(prev => prev + 1);
        } else {
            setLike(false);
            setLikeCount(prev => prev - 1);
        }
        // setLikeCount(like ? likeCount - 1 : likeCount + 1)
        // setLike(!like)
    };

    // optionButton
    const [isOptionButtonOpen, setIsOptionButtonOpen] = useState(false);

    const handleClick = () => {
        setIsOptionButtonOpen(!isOptionButtonOpen);
    };

    const onDeleteClick = async () => {
        try {
            post.img.url && await axios.delete(`/upload/${post.img.public_id}`);
            await axios.delete(`/posts/${post._id}`, {
                data: { userId: currentUser._id },
            });
            console.log("deleted successfully");

            // Calling the onDelete function received from the Feed component to update posts state
            onDelete(post._id);
        } catch (err) {
            console.warn(err);
        }
    };

    const [editMode, setEditMode] = useState(false);
    // const [editedDesc, setEditedDesc] = useState(post.desc);
    const editedDesc = useRef(null);

    const onEditClick = () => {
        setEditMode(true);
    };

    useEffect(() => {
        if (editMode) {
            editedDesc.current.focus();
        }
    }, [editMode]);


    const onSaveEdit = async () => {
        try {
            const res = await axios.put(`/posts/${post._id}`, {
                desc: editedDesc.current.value, userId: currentUser._id
            });
            const updatedPost = res.data;
            onEdit(post._id, updatedPost)
            setEditMode(false);
        } catch (err) {
            console.log("Failed to save edit", err);
        }
    };


    return (
        <div className='post'>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img
                            className='postProfileImg'
                            src={
                                user?.profilePicture?.url || "/assets/noAvatar.png"
                            }
                            alt="_img"
                            onClick={() => navigate(`/profile/${user.username}`)}
                        />
                        <span className="postUsername" onClick={() => navigate(`/profile/${user.username}`)}>{user.name}</span>
                        <span className="postDate">
                            <ReactTimeAgo date={Date.parse(post.createdAt)} locale='en-US' />
                        </span>
                    </div>
                    {currentUser.username === user.username && (
                        <div className="postTopRight">
                            <div className="optionsButton" onClick={handleClick}>
                                <IconButton>
                                    <MoreVert />
                                </IconButton>
                                {isOptionButtonOpen && (
                                    <ul className='optionsButtonContainer'>
                                        <li onClick={onDeleteClick}>delete</li>
                                        <hr />
                                        <li onClick={!editMode ? onEditClick : onSaveEdit}>{!editMode ? 'edit' : 'save'}</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="postCenter">
                    {editMode ? (
                        <input
                            type="text"
                            ref={editedDesc}
                            className='editInput'
                            placeholder='write a caption...'
                        />
                    ) : (
                        <span className="postText">{post?.desc}</span>
                    )}
                    <img className='postImg' src={post.img.url} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {!like ? (
                            <IconButton onClick={likeHandler}>

                                <FavoriteBorder
                                    className="bottomIcons"
                                    sx={{ fontSize: 23 }}
                                />
                            </IconButton>
                        ) : (
                            <IconButton onClick={likeHandler}>
                                <Favorite
                                    htmlColor='tomato'
                                    className="bottomIcons"
                                    sx={{ fontSize: 23 }}
                                />
                            </IconButton>
                        )}
                        <IconButton onClick={() => setIsOpen(!isOpen)}>
                            <ChatBubbleOutline className="bottomIcons" sx={{ fontSize: 22 }}></ChatBubbleOutline>
                        </IconButton>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{comments.length} comment</span>
                    </div>
                </div>
                <span className="postLikeCounter">{likeCount} people like it</span>
            </div>
            {isOpen && <Comment currentUser={currentUser} post={post} comments={comments} setComments={setComments} />}
        </div>
    );
};

export default Post;