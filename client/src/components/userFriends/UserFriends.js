import React from 'react';
import './userFriends.css';
import axios from 'axios';

const UserFriends = ({ onlineUsers, userFriends, currentId, setCurrentChat }) => {

    const handleClick = async (userFriend) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${userFriend._id}`)
            setCurrentChat(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className='userChat'>
            {
                userFriends?.map((userFriend) => (
                    <div key={userFriend._id} className="userFriend" onClick={() => { handleClick(userFriend) }}>
                        <div className="userFriendImgContainer">
                            <img className='userFriendImg' src={userFriend?.profilePicture?.url || "/assets/noAvatar.png"} alt="" />
                            {
                                onlineUsers.map(onlineUser => (
                                    (userFriend._id === onlineUser) ? <div className="userOnlineBadge" key={userFriend._id}></div> : ""
                                ))
                            }
                        </div>
                        <div className='nameMsg'>
                            <span className="userFriendsName">{userFriend.name}</span>
                            <p className='newMsg'>{"New Message, click to see!rggggggggggggggggfgtyyyyyyyuhghhhhhhhhhhftytgggggggggg".substring(0, 33)}...</p>
                        </div>
                        <span className='msgTime'>08:00am</span>
                    </div>
                ))
            }
        </div>
    )
}

export default UserFriends;