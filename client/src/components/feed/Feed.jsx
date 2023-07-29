import React, { useContext, useEffect, useState } from 'react';
import "./feed.css";
import Share from '../share/Share';
import Post from '../post/Post';
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Feed = () => {

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const { username } = useParams();

    const location = useLocation();
    const currentUrl = location.pathname;

    useEffect(() => {
        const fetchPosts = async () => {
            const res = user.username !== username
                ? await axios.get("/posts/profile/" + username)
                : currentUrl === `/${username}/timeline` ? await axios.get("posts/timeline/" + user._id) : await axios.get("/posts/profile/" + username)

            setPosts(res?.data?.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }))
        }
        fetchPosts()
    }, [username, user, currentUrl]);

    return (
        <div className='feed'>
            <div className="feedWrapper">
                {
                    (!username || username === user.username) && <Share />
                }
                {
                    posts?.map((post) => {
                        return <Post key={post._id} post={post} />
                    })
                }
            </div>
        </div>
    )
}

export default Feed