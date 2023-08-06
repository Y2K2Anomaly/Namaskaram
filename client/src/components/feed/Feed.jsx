import React, { useContext, useEffect, useState } from 'react';
import "./feed.css";
import Share from '../share/Share';
import Post from '../post/Post';
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Feed = ({ hideFeed }) => {
    const [posts, setPosts] = useState([]);
    const [newPosts, setNewPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const { username } = useParams();
    const location = useLocation();
    const currentUrl = location.pathname;

    useEffect(() => {
        const fetchPosts = async () => {
            const res = (user.username === username && currentUrl === `/${user.username}/timeline`) ? await axios.get("posts/timeline/" + user._id) : await axios.get("/posts/profile/" + username);

            setPosts(res?.data?.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }));
        };
        fetchPosts();
    }, [username, user, currentUrl, newPosts]);

    // Function to update posts state after a post is deleted
    const handlePostDelete = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };

    // Function to update posts state after sharing a new post
    const handlePostShare = (newPost) => {
        setNewPosts(prevPosts => [newPost, ...prevPosts]);
    }

    // Function to Edit Post desc
    const handleEdit = (postId, updatedPost) => {
        setPosts(prevPosts =>
            prevPosts.map(post => (post._id === postId ? updatedPost : post))
        );
        console.log(updatedPost)
    };


    return (
        <>
            <div className={hideFeed ? 'feed hideFeed' : 'feed'}>
                <div className="feedWrapper">

                    {(username === user.username) && <Share onPostShare={handlePostShare} />}
                    {posts.length === 0 && <h1 className='noPostHeading'>No Posts yet</h1>}

                    {posts.map((post) => (
                        // Pass handlePostDelete function as a prop to Post component
                        <Post key={post._id} post={post} onDelete={handlePostDelete} onEdit={handleEdit} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Feed;
