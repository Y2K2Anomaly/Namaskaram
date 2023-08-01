import React, { useEffect, useState } from 'react';
import './chatOnline.css';
import axios from 'axios';

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {

    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId)
            setFriends(res.data)
        }

        getFriends()
    }, [currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter((friend) => onlineUsers.includes(friend._id)));
    }, [friends, onlineUsers])

    const handleClick = async (onlineFriend) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${onlineFriend._id}`)
            setCurrentChat(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className='chatOnline'>
            {
                onlineFriends?.map((onlineFriend) => (
                    <div className="chatOnlineFriend" onClick={() => { handleClick(onlineFriend) }}>
                        <div className="chatOnlineImgContainer">
                            <img className='chatOnlineImg' src={onlineFriend?.profilePicture?.url || "/assets/noAvatar.png"} alt="" />
                            <div className="chatOnlineBadge"></div>
                        </div>
                        <span className="chatOnlineName">{onlineFriend.name}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default ChatOnline;