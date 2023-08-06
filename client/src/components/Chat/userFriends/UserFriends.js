import React, { useState, useEffect } from 'react';
import './userFriends.css';
import axios from 'axios';
import moment from 'moment';

const UserFriends = ({ onlineUsers, userFriends, currentUserId, setCurrentChat, addConversation, setChatFriend, setIsOpen }) => {

    const [allConversations, setAllConversations] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);

    // Function to get the last message of a conversation
    const getLastMessage = async (conversationId) => {
        try {
            const res = await axios.get(`/messages/last/${conversationId}`);
            return res.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get('/conversations/all');
                setAllConversations(res.data);

                // Fetch last messages after conversations
                const messages = {};
                for (const conversation of res.data) {
                    const lastMessage = await getLastMessage(conversation._id);
                    messages[conversation._id] = lastMessage;
                }
                setLastMessages(messages);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    const handleClick = async (userFriend) => {
        const conversationData = {
            receiverId: userFriend._id,
            senderId: currentUserId
        };
        addConversation(conversationData);
        setChatFriend(userFriend);
        setIsOpen(prev => !prev);
        try {
            const res = await axios.get(`/conversations/find/${currentUserId}/${userFriend._id}`)
            setCurrentChat(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className='userChat'>
            {
                userFriends?.map((userFriend) => {

                    const conversation = allConversations?.filter(conversation => (conversation.members?.includes(userFriend._id) && conversation.members?.includes(currentUserId)));
                    const conversationId = conversation?.map(conversation => conversation?._id);
                    const [lastMessage] = lastMessages[conversationId] || [];

                    return (
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
                                <p className='newMsg'>
                                    {(lastMessage ? lastMessage.text : "Start a chat").substring(0, 33)}<strong> ...</strong>
                                </p>
                            </div>
                            <span className='msgTime'>
                                {moment(lastMessage?.createdAt).fromNow()}
                            </span>
                        </div>)
                })
            }
        </div>
    )
}

export default UserFriends;