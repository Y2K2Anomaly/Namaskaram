import React from 'react';
import "./sidebar.css";
import {
    RssFeed,
    Chat
} from "@mui/icons-material";
import { Users } from "../../dummyData";
import CloseFriend from '../closeFriend/CloseFriend';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <RssFeed className="sidebarIcon" sx={{ fontSize: 22 }} />
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                        <Chat className="sidebarIcon" sx={{ fontSize: 22 }} />
                        <span className="sidebarListItemText">Chats</span>
                    </li>
                </ul>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                    <h3 className="sidebarFriendSuggestionList">Friend Suggestions</h3>
                    {
                        Users.map((user) => {
                            return <CloseFriend
                                key={user.id}
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