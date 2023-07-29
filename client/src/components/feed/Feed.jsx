import React, { useContext, useEffect, useState } from 'react';
import "./feed.css";
import Share from '../share/Share';
import Post from '../post/Post';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from 'react-router-dom';

const Feed = () => {

    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            const res = username
                ? await axios.get("/posts/profile/" + username)
                : await axios.get("posts/timeline/" + user._id)

            setPosts(res?.data?.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }))
        }
        fetchPosts()
    }, [username, user]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setCurrentUser(res.data);
        };
        fetchUser();
    }, [username]);

    return (
        <div className='feed'>
            <div className="feedWrapper">
                {
                    (!username || username === user.username) && <Share currentUser={currentUser} />
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