import React from 'react';
import './closeFriend.css';
import { useNavigate } from 'react-router';

const CloseFriend = ({ user }) => {
    const navigate = useNavigate();

    return (
        <>
            <li className="sidebarFriend" onClick={() => navigate(`/profile/${user.username}`)}>
                <img
                    className="sidebarFriendImg"
                    src={user?.profilePicture?.url || "/assets/noAvatar.png"}
                    alt=""
                />
                <span className="sidebarFriendName">{user.name}</span>
            </li>
        </>
    )
}

export default CloseFriend