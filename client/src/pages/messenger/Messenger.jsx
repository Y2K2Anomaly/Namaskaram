import React, { useContext, useEffect, useState, useRef } from 'react';
import './messenger.css';
import Topbar from "../../components/topbar/Topbar";
import Message from '../../components/Chat/message/Message';
import ChatOnline from '../../components/Chat/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ArrowBackIos, Delete, KeyboardReturn, MoreVert, Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import UserFriends from '../../components/Chat/userFriends/UserFriends';
import { useNavigate } from 'react-router-dom';
import OnlineBadge from '../../components/Chat/badges/OnlineBadge';
import OfflineBadge from '../../components/Chat/badges/OfflineBadge';

const Messenger = React.memo(() => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatFriend, setChatFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentUserFriends, setCurrentUserFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [convOption, setConvOption] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + user._id)
      setCurrentUserFriends(res.data)
    }

    getFriends()
  }, [user])

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text
      })
    });
  }, []);

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages(prev => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", users => {
      setOnlineUsers(
        user.followings.filter((following) => users.some((u) => u.userId === following)))
    })
  }, [user])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    getConversations();
  }, [user])

  // add a conversation
  const addConversation = async ({ receiverId, senderId }) => {
    try {
      console.log(receiverId, senderId);

      // Checking if a conversation with the same participants already exists
      const duplicateConvo = conversations?.find(conversation =>
        conversation.members?.includes(receiverId) && conversation.members?.includes(senderId)
      );

      if (duplicateConvo) {
        console.log("Duplicate conversation already exists:", duplicateConvo);
      } else {
        console.log("No duplicate conversation found. Creating a new conversation...");
        const res = await axios.post('/conversations/', { receiverId, senderId });
        setConversations([...conversations, res?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id)
        setMessages(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    getMessages()
  }, [currentChat])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat?._id
    };

    const receiverId = currentChat?.members.find(memberId => memberId !== user._id)

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage
    })

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res?.data])
      setNewMessage("");
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onDeleteHandler = async ({ messageId }) => {
    try {

      const res = await axios.delete(`/messages/${messageId}`);
      const deletedMessage = res.data;
      const filteredMessages = messages.filter(message => message._id !== deletedMessage._id)
      setMessages(filteredMessages)
    } catch (err) {
      console.error(err)
    }
  }

  const onDeleteConversation = async () => {
    try {
      const res = await axios.delete(`/conversations/delete/${currentChat._id}`)
      const deletedConversation = res.data;
      const filteredConversations = conversations.filter(conversation => conversation._id !== deletedConversation._id)
      setConversations(filteredConversations)
      window.location.reload();
      console.log(conversations)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className='messengerComponent'>
        <Topbar />
        <div className="messenger">
          <div className={!isOpen ? "chatMenu" : "chatMenu chatMenuVisible"}>
            <div className="chatMenuWrapper">
              <div className='chatMenuHeading'>
                <h5 className='chatMenuHeading'>Chats</h5>
              </div>
              <input placeholder='Search for friends' className='chatMenuInput' />

              <hr />
              <div className="chatOnline">
                <div className="chatWrapper">
                  <h5 className='chatHeading'>Online Friends: {onlineUsers.length}</h5>
                  {
                    onlineUsers.length ? (
                      <ChatOnline
                        onlineUsers={onlineUsers}
                        currentUserId={user._id}
                        userFriends={currentUserFriends}
                        setCurrentChat={setCurrentChat}
                        addConversation={addConversation}
                        setChatFriend={setChatFriend}
                        setIsOpen={setIsOpen}
                      />
                    ) : <h6>No Online Friends</h6>
                  }
                </div>
              </div>
              <hr />
              <div className="chatOnline">
                <div className="chatWrapper">
                  <h5 className='chatHeading'>All Friends: {currentUserFriends.length}</h5>
                  {
                    currentUserFriends.length ? (
                      <UserFriends
                        onlineUsers={onlineUsers}
                        userFriends={currentUserFriends}
                        currentUserId={user._id}
                        setCurrentChat={setCurrentChat}
                        addConversation={addConversation}
                        setChatFriend={setChatFriend}
                        setIsOpen={setIsOpen}
                      />
                    ) : <h6>No User Friends</h6>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="vertical-hr-wrapper">
            <hr />
          </div>

          <div className={!isOpen ? "chatBox" : "chatBox chatBoxVisible"}>
            <div className="chatBoxWrapper">
              {
                currentChat ? (
                  <>
                    <div className="chatBoxTop">
                      <div className="chatBoxHeader">
                        <div className="chatBoxHeaderLeft">
                          <IconButton onClick={() => setIsOpen(prev => !prev)}>
                            <ArrowBackIos className='backIcon' sx={{ fontSize: "25px" }} />
                          </IconButton>
                          <div className="chatBoxHeaderImg" onClick={() => navigate('/profile/' + chatFriend.username)}>
                            <img src={chatFriend?.profilePicture.url || "/assets/noAvatar.png"} alt="" />
                            <div className='rippleBadge'>
                              {
                                onlineUsers.includes(chatFriend._id) ? (
                                  <OnlineBadge
                                    overlap='circular'
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right"
                                    }}
                                    variant='dot'
                                  />
                                ) : (
                                  <OfflineBadge
                                    overlap='circular'
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right"
                                    }}
                                    variant='dot'
                                  />
                                )
                              }
                            </div>
                          </div>
                          <div className="nameOnlineContainer">
                            <h4 onClick={() => navigate('/profile/' + chatFriend.username)}>{chatFriend?.name}</h4>
                            <span className='onlineSpan'>
                              {onlineUsers.includes(chatFriend._id) ?
                                "Online" : "Offline"
                              }
                            </span>
                          </div>
                        </div>
                        <div className="chatBoxHeaderRight">
                          <IconButton onClick={() => setConvOption(!convOption)}>
                            {!convOption ? <MoreVert sx={{ fontSize: "25px" }} /> : <KeyboardReturn sx={{ fontSize: "25px" }} />}
                          </IconButton>
                          {
                            convOption && (
                              <IconButton className="deleteButton" onClick={onDeleteConversation}>
                                <Delete sx={{ fontSize: "30px", color: "red" }} />
                              </IconButton>
                            )
                          }
                        </div>
                      </div>
                    </ div>

                    <div className="chatBoxCenter">
                      {
                        messages.map((m, index) => (
                          <div ref={scrollRef} key={index}>
                            <Message message={m} own={m.sender === user._id} chatFriend={chatFriend} user={user} onDelete={onDeleteHandler} />
                          </div>
                        ))
                      }
                    </div>

                    <div className="chatBoxBottom">
                      <textarea
                        className="chatMessageInput"
                        placeholder="write something..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <IconButton onClick={handleSubmit}>
                        <div className='sendIcon'>
                          <Send sx={{ color: '#fff', fontSize: "30px" }} />
                        </div>
                      </IconButton>
                    </div>
                  </>
                ) : <span className='noConversationText'>Open a Conversation to start a Chat</span>
              }

            </div>
          </div>
        </div >
      </div >
    </>
  )
})

export default Messenger;