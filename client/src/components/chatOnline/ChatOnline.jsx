import React, { useEffect, useState } from 'react';
import './chatOnline.css';
import axios from 'axios';
import moment from 'moment';

const ChatOnline = ({ onlineUsers, userFriends, currentUserId, setCurrentChat, addConversation, setChatFriend }) => {

    const [onlineFriends, setOnlineFriends] = useState([]);
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

    useEffect(() => {
        setOnlineFriends(userFriends.filter((friend) => onlineUsers.includes(friend._id)));
    }, [userFriends, onlineUsers])

    const handleClick = async (onlineFriend) => {
        const conversationData = {
            receiverId: onlineFriend._id,
            senderId: currentUserId
        };
        addConversation(conversationData)
        setChatFriend(onlineFriend)

        try {
            const res = await axios.get(`/conversations/find/${currentUserId}/${onlineFriend._id}`)
            setCurrentChat(res.data)
        } catch (err) {
            console.log(err)
        }
    };


    return (
        <div className='onlineUser'>
            {onlineFriends?.map((onlineFriend) => {

                const conversation = allConversations?.filter(conversation => (conversation.members?.includes(onlineFriend._id) && conversation.members?.includes(currentUserId)));
                const conversationId = conversation?.map(conversation => conversation?._id);
                const [lastMessage] = lastMessages[conversationId] || [];

                return (
                    <div key={onlineFriend._id} className="chatOnlineFriend" onClick={() => { handleClick(onlineFriend) }}>
                        <div className="chatOnlineImgContainer">
                            <img className='chatOnlineImg' src={onlineFriend?.profilePicture?.url || "/assets/noAvatar.png"} alt="" />
                            <div className="chatOnlineBadge"></div>
                        </div>
                        <div className='nameMsg'>
                            <span className="chatOnlineName">{onlineFriend?.name}</span>
                            <p className='newMsg'>{lastMessage?.text}</p>
                        </div>
                        <span className='msgTime'>
                            {moment(lastMessage?.createdAt).fromNow()}
                        </span>
                    </div>
                );
            })}
        </div>
    )
}

export default ChatOnline;