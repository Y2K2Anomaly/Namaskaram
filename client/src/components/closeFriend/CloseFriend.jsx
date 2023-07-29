import React from 'react';
import './closeFriend.css';
import { useNavigate } from 'react-router';

const CloseFriend = ({ user }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const navigate = useNavigate();

    return (
        <>
            <li className="sidebarFriend" onClick={() => navigate(`/profile/${user.username}`)}>
                <img
                    className="sidebarFriendImg"
                    src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                    alt=""
                />
                <span className="sidebarFriendName">{user.username}</span>
            </li>
        </>
    )
}

export default CloseFriend