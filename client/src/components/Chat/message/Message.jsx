import React, { useState } from 'react';
import './message.css';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';

const Message = ({ message, own, chatFriend, user, onDelete }) => {

    const [isDelete, setIsDelete] = useState(false);

    return (
        <div className={own ? 'message own' : 'message'} onClick={() => setIsDelete(!isDelete)}>
            <div className="messageTop">
                <img src={(own && user?.profilePicture.url) || (!own && chatFriend.profilePicture.url) || "/assets/noAvatar.png"} className='messageImg' alt="" />
                <p className='messageText'>{message.text}</p>

                {own && isDelete ? (
                    <IconButton className="deleteButton" onClick={() => onDelete({ messageId: message._id })}>
                        <Delete sx={{ fontSize: "18px", color: "red" }} />
                    </IconButton>
                ) : ""}
            </div>
            <div className="messageBottom">
                {moment(message.createdAt).fromNow()}
            </div>
        </div>
    )
}

export default Message