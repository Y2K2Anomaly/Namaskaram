import React, { useContext, useEffect, useState } from 'react';
import './topbar.css';
import { Search, Person, Chat, Notifications, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Topbar = ({ setShowSidebar }) => {
    const { user: currentUser } = useContext(AuthContext);
    const [sameUser, setSameUser] = useState({});
    const navigate = useNavigate();

    const logOut = async () => {
        localStorage.removeItem('user');
        navigate("/login")
        window.location.reload();
    }

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${currentUser?.username}`);
            setSameUser(res.data)
        };
        fetchUser();
    }, [currentUser?.username]);

    return (
        <div className='topbarContainer'>
            <div
                className="topbarLeft"
                onClick={() => setShowSidebar ? setShowSidebar(prev => !prev) : 0}
            >
                <Link to={"/" + currentUser.username + "/timeline"} style={{ textDecoration: "none" }}>
                    <span className="logo">Namaskaram</span>
                    <img src='/assets/namaste_icon.png' alt='#logo' className='namasteIcon' />
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className='searchIcon' />
                    <input
                        type="text"
                        className="searchInput"
                        placeholder='Search for friend, post or video'
                    />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarIcons">
                    <div className="topbarIconItem hide">
                        <IconButton>
                            <Person sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">0</span>
                    </div>
                    <div
                        className="topbarIconItem"
                        onClick={() => navigate("/messenger")}
                    >
                        <IconButton>
                            <Chat sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">0</span>
                    </div>
                    <div className="topbarIconItem">
                        <IconButton>
                            <Notifications sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">0</span>
                    </div>
                </div>
                <div className='logOutButton' onClick={logOut}>
                    <Link>
                        <span className='logoutText'>Logout</span>
                        <IconButton>
                            <Logout sx={{ fontSize: 25, color: 'white' }} />
                        </IconButton>
                    </Link>
                </div>
                <Link to={`/profile/${currentUser?.username}`}>
                    <IconButton>
                        <img
                            src={sameUser?.username === currentUser.username ? (sameUser?.profilePicture?.url || "/assets/noAvatar.png") : "/assets/noAvatar.png"}
                            alt="img"
                            className='topbarImg'
                        />
                    </IconButton>
                </Link>
            </div>
        </div>
    )
}

export default Topbar