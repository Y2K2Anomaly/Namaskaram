import React from 'react';
import "./online.css";
import { useNavigate } from "react-router";

const Online = ({ friend }) => {
    const navigate = useNavigate();
    return (
        <>
            <li className="rightbarFriend" onClick={() => navigate(`/profile/${friend.username}`)}>
                <div className="rightbarProfileImgContainer">
                    <img className="rightbarProfileImg" src={friend?.profilePicture?.url || "/assets/noAvatar.png"} alt="" />
                    <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{friend?.name}</span>
            </li>
        </>
    )
}

export default Online