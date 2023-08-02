import React, { useEffect, useState } from 'react';
import './conversation.css';
import axios from 'axios';

const Conversation = ({ conversation, currentUser }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId)
                setUser(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getUser()
    }, [currentUser, conversation])

    return (
        <div className="conversation">
            <img
                className="conversationImg"
                alt="userImg"
                src={user?.profilePicture?.url || "assets/noAvatar.png"}
            />

            <span className="conversationName">
                {user?.name}
            </span>
        </div>
    )

}

export default Conversation;