import React, { useContext, useEffect, useState } from 'react';
import "./sidebar.css";
import {
    RssFeed,
    Chat
} from "@mui/icons-material";
import CloseFriend from '../closeFriend/CloseFriend';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get("/users/all");
            setAllUsers(res.data);
        }
        fetchUsers();
    }, [])

    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem" onClick={() => navigate(`/${currentUser.username}/timeline`)}>
                        <RssFeed className="sidebarIcon" sx={{ fontSize: 22 }} />
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem" onClick={() => navigate('/messenger')} >
                        <Chat className="sidebarIcon" sx={{ fontSize: 22 }} />
                        <span className="sidebarListItemText">Chats</span>
                    </li>
                </ul>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                    <h3 className="sidebarFriendSuggestionList">Friend Suggestions</h3>
                    {
                        allUsers.map((user) => {
                            return <CloseFriend
                                key={user._id}
                                user={user}
                            />
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Sidebar