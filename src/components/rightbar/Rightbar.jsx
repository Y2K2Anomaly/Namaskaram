import React, { useContext, useState, useEffect, useRef } from 'react';
import "./rightbar.css";
import Online from "../online/Online";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from "@mui/icons-material";
import { io } from 'socket.io-client';

const Rightbar = React.memo(() => {

    const [user, setUser] = useState({});
    const [userFriends, setUserFriends] = useState([]);
    const [userOnlineFriends, setUserOnlineFriends] = useState([]);
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [currentUserFriends, setCurrentUserFriends] = useState([]);
    const [currentUserOnlineFriends, setCurrentUserOnlineFriends] = useState([]);
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);


    useEffect(() => {
        setFollowed(currentUser?.followings.includes(user?._id))
    }, [currentUser?.followings, user?._id]);

    useEffect(() => {
        const getFriends = async () => {
            if (user?._id) {
                try {
                    const friendList = await axios.get("/users/friends/" + user?._id);
                    setUserFriends(friendList?.data);
                } catch (err) {
                    console.log(err);
                }
            }
        };

        getFriends()
    }, [user])

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentUser._id)
            setCurrentUserFriends(res?.data)
        }

        getFriends()
    }, [currentUser._id])

    const handleClick = async () => {
        try {
            if (followed) {
                await axios.put("/users/" + user._id + "/unfollow", {
                    userId: currentUser._id
                })
                dispatch({ type: "UNFOLLOW", payload: user._id })
            } else {
                await axios.put("/users/" + user._id + "/follow", { userId: currentUser._id })
                dispatch({ type: "FOLLOW", payload: user._id })
            }
        } catch (err) {
            console.log(err)
        }
        setFollowed(!followed)
    };

    const socket = useRef();
    // Fetching Online Friends
    useEffect(() => {

        socket.current = io("wss://namaskaram-api.onrender.com");

        // Emitting 'addUser' event to let the server know about the current user
        socket.current.emit("addUser", currentUser._id);
        socket.current.emit("addUser", user._id);

        // Listening for 'getUsers' event to get the online users array
        socket.current.on("getUsers", (users) => {
            const onlineFriendIds = users.map((user) => user.userId);
            const onlineFriends = currentUserFriends.filter(friend => onlineFriendIds.includes(friend._id)
            );
            setCurrentUserOnlineFriends(onlineFriends);
        });
        socket.current.on("getUsers", (users) => {
            const onlineFriendIds = users.map((user) => user.userId);

            const onlineFriends = userFriends.filter(friend => onlineFriendIds.includes(friend._id)
            );
            setUserOnlineFriends(onlineFriends);
        });

        // Cleaning up the socket connection when the component unmounts
        return () => {
            socket.current.disconnect();
        };
    }, [user?._id, currentUser._id, currentUserFriends, userFriends]);

    const dateString = user?.dateOfBirth;
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();

    const DOBformatted = `${day} ${month} ${year}`;


    const location = useLocation().pathname;

    return (
        <div
            className={location === `/${currentUser.username}/timeline` ? "rightbar hide" : "rightbar"}>
            <div className="rightbarWrapper">
                {user.username !== currentUser.username && (
                    <button
                        className="rightbarFollowButton"
                        onClick={handleClick}
                    >
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}

                <h4 className='rightbarTitle'>User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Name: </span>
                        <span className="rightbarInfoValue">{user.name}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City: </span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From: </span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    {user.dateOfBirth && (
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">Date Of Birth: </span>
                            <span className="rightbarInfoValue">{DOBformatted}</span>
                        </div>
                    )}
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship: </span>
                        <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Committed" : user.relationship >= 3 ? "Polyamory" : ""}</span>
                    </div>
                </div>
                <h4 className='rightbarTitle'>User friends: {userFriends.length}</h4>
                <div className="rightbarFollowings">
                    {
                        userFriends.length ? (
                            userFriends.map((friend, index) => (
                                <div
                                    className="rightbarFollowing"
                                    key={index}
                                    onClick={() => navigate(`/profile/${friend.username}`)}
                                >
                                    <img
                                        src={friend?.profilePicture?.url || "/assets/noAvatar.png"}
                                        alt="_img"
                                        className="rightbarFollowingImg"
                                    />
                                    <span className='rightbarFollowingName'>{friend.name}</span>
                                </div>
                            ))
                        ) : <h5>No User Friends</h5>
                    }
                </div>


                {currentUser.username === user.username ? (
                    <div>
                        <h4 className='rightbarTitle'>Online Friends: {currentUserOnlineFriends.length}</h4>
                        {currentUserOnlineFriends.length ? (
                            <ul className="rightbarFriendList">
                                {currentUserOnlineFriends.map(friend => (
                                    <Online key={friend._id} friend={friend} />
                                ))}
                            </ul>
                        ) : <h5>No Online Friends</h5>
                        }
                    </div>) : (
                    <div>
                        <h4 className='rightbarTitle'>Online Friends: {userOnlineFriends.length}</h4>
                        <ul className="rightbarFriendList">
                            {userOnlineFriends.length ? (
                                userOnlineFriends.map(friend => (
                                    <Online key={friend._id} friend={friend} />
                                ))
                            ) : <h5>No Online Friends</h5>}
                        </ul>
                    </div>)
                }
            </div>
        </div>
    );
})

export default Rightbar;