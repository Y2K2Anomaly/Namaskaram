import React, { useContext, useEffect, useState } from 'react';
import './topbar.css';
import { Search, Person, Chat, Notifications, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Topbar = () => {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { username } = useParams();

    const logOut = async () => {
        await axios.put("auth/logout", user)
        localStorage.removeItem('user');
        navigate("/login")
        window.location.reload();
    }

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setCurrentUser(res.data);
        };
        fetchUser();
    }, [username]);

    return (
        <div className='topbarContainer'>
            <div className="topbarLeft">
                <Link to={"/" + user.username} style={{ textDecoration: "none" }}>
                    <span className="logo">Namaskaram</span>
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
                    <div className="topbarIconItem">
                        <IconButton>
                            <Person sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div
                        className="topbarIconItem"
                        onClick={() => navigate("/messenger")}
                    >
                        <IconButton>
                            <Chat sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <IconButton>
                            <Notifications sx={{ fontSize: 22, color: 'white' }} />
                        </IconButton>
                        <span className="topbarIconBadge">1</span>
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
                <Link to={`/profile/${user.username}`}>
                    <IconButton>
                        <img
                            src={
                                currentUser?.profilePicture ? PF + currentUser?.profilePicture : PF + "person/noAvatar.png"
                            }
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