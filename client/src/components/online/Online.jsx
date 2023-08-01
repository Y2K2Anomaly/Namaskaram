import React from 'react';
import "./online.css";

const online = ({ friend }) => {
    return (
        <>
            <li className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                    <img className="rightbarProfileImg" src={friend?.profilePicture?.url || "/assets/noAvatar.png"} alt="" />
                    <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{friend?.name}</span>
            </li>
        </>
    )
}

export default online