import React, { useContext, useEffect, useState } from 'react';
import './message.css';
import ReactTimeAgo from "react-time-ago";
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Message = ({ message, own, currentChat }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    const [conversationFriendId, setConversationFriendId] = useState("");
    const [conversationFriendData, setConversationFriendData] = useState({});
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() => {
        const getFriend = async () => {
            const res = await axios.get("/users/friends/" + currentUser?._id)
            setUserFriends(res.data)
        }

        getFriend()
    }, [currentUser?._id])

    useEffect(() => {
        currentChat?.members.map(m_id => {
            if (m_id !== currentUser?._id) {
                setConversationFriendId(m_id)
            }
            return null;
        }
        )
    }, [currentChat, currentUser?._id])

    console.log(conversationFriendData);

    useEffect(() => {
        userFriends.map((userFriend) => {
            if (conversationFriendId === userFriend._id) {
                setConversationFriendData(userFriend)
            }
            return null;
        }
        )
    }, [conversationFriendId, userFriends])

    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img
                    className='messageImg'
                    src={own ? PF + currentUser.profilePicture : conversationFriendData.profilePicture ? PF + conversationFriendData.profilePicture : PF + "person/noAvatar.png"}
                    alt=""
                />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">
                <ReactTimeAgo date={message.createdAt} locale='en-US' />
            </div>
        </div>
    )
}

export default Message