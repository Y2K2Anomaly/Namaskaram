import React, { useContext, useState, useEffect } from 'react';
import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from "@mui/icons-material";

const Rightbar = () => {

    const [user, setUser] = useState({});
    const { username } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.followings.includes(user?._id));

    useEffect(() => {
        setFollowed(currentUser?.followings.includes(user?._id))
    }, [currentUser?.followings, user?._id])

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get("/users/friends/" + user?._id)
                setFriends(friendList.data)
            } catch (err) {
                console.log(err)
            }
        }

        getFriends()

    }, [user])


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

    const HomeRightbar = () => (
        <>
            <div className="birthdayContainer">
                <img className='birthdayImg' src={`${PF}gift.png`} alt="gift.icon" />
                <span className="birthdayText">
                    <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
                </span>
            </div>
            <img className='rightbarAd' src={`${PF}ad.png`} alt="add.img" />
            <h4 className='rightbarTitle'>Online Friends</h4>
            <ul className="rightbarFriendList">
                {
                    Users.map(user => {
                        return <Online
                            key={user.id}
                            user={user}
                        />
                    })
                }
            </ul>
        </>
    );

    const ProfileRightbar = () => (
        <>
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
                    <span className="rightbarInfoKey">City: </span>
                    <span className="rightbarInfoValue">{user.city}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">From: </span>
                    <span className="rightbarInfoValue">{user.from}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">Relationship: </span>
                    <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
                </div>
            </div>
            <h4 className='rightbarTitle'>User friends</h4>
            <div className="rightbarFollowings">
                {
                    friends.map((friend, index) => (
                        <Link
                            to={`/profile/${friend.username}`}
                            style={{ textDecoration: "none" }}
                            key={index}
                        >
                            <div
                                className="rightbarFollowing"
                                key={index}>
                                <img
                                    src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
                                    alt=""
                                    className="rightbarFollowingImg"
                                />
                                <span
                                    className='rightbarFollowingName'
                                >{friend.username}</span>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    );

    return (
        <div className='rightbar'>
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}

export default Rightbar;