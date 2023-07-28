import React, { useContext, useEffect, useState } from 'react';
import './post.css';
import { MoreVert, FavoriteBorder, Favorite, ChatBubbleOutline } from "@mui/icons-material";
import axios from 'axios';
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { AuthContext } from '../../context/AuthContext';

const Post = ({ post }) => {

    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [like, setLike] = useState(false);
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        setLike(post.likes.includes(currentUser._id))
    }, [currentUser._id, post.likes])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data)
        }
        fetchUser()
    }, [post.userId]);

    const likeHandler = () => {

        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) {
            console.log(err);
        }
        if (!like) {
            setLike(true)
            setLikeCount(prev => prev + 1)
        } else {
            setLike(false)
            setLikeCount(prev => prev - 1)
        }
        // setLikeCount(like ? likeCount - 1 : likeCount + 1)
        // setLike(!like)
    }

    return (
        <div className='post'>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`profile/${user.username}`}>
                            <img className='postProfileImg' src={
                                user.profilePicture
                                    ? PF + user.profilePicture
                                    : PF + "person/noAvatar.png"
                            } alt="_img" />
                        </Link>
                        <span className="postUsername">
                            {user.username}
                        </span>
                        <span className="postDate">
                            <ReactTimeAgo date={Date.parse(post.createdAt)} locale='en-US' />
                        </span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img className='postImg' src={PF + post.img} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {
                            !like ? <FavoriteBorder
                                className="bottomIcons"
                                onClick={likeHandler} sx={{ fontSize: 23 }} /> :
                                <Favorite
                                    htmlColor='tomato'
                                    className="bottomIcons"
                                    onClick={likeHandler}
                                    sx={{ fontSize: 23 }}
                                />
                        }
                        <ChatBubbleOutline className="bottomIcons" sx={{ fontSize: 22 }} />
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comment</span>
                    </div>
                </div>
                <span className="postLikeCounter">{likeCount} people like it</span>
            </div>
        </div>
    )
}

export default Post