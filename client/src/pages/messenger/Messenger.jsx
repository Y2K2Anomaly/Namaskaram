import React, { useContext, useEffect, useState, useRef } from 'react';
import './messenger.css';
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';


const Messenger = () => {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
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
  }, [user._id])

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
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(memberId => memberId !== user._id)

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    })

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data])
      setNewMessage("");
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div>
              <h5 className='h5Heading'>Chats</h5>
              <input placeholder='Search for friends' className='chatMenuInput' />
            </div>
            {
              conversations.map((c, index) => (
                <div onClick={() => setCurrentChat(c)} key={index}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))
            }
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {
              currentChat ?
                (
                  <>
                    <div className="chatBoxTop">
                      {
                        messages.map((m, index) => (
                          <div ref={scrollRef} key={index} >
                            <Message message={m} own={m.sender === user._id} currentChat={currentChat} />
                          </div>
                        ))
                      }
                    </div>
                    <div className="chatBoxBottom">
                      <textarea
                        className="chatMessageInput"
                        placeholder='write something...'
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                      ></textarea>
                      <button className="chatSubmitButton" onClick={handleSubmit}>
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <span className='noConversationText'>Open a Conversation to start a Chat</span>
                )
            }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <h5 className='h5Heading'>Online Friends</h5>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger;