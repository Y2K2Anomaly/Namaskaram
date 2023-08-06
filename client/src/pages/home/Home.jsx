import React, { useContext, useState } from 'react'
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';
import Feed from '../../components/feed/Feed';
import "./home.css";
import { AuthContext } from '../../context/AuthContext';

const Home = () => {

    const { user } = useContext(AuthContext);
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <Topbar setShowSidebar={setShowSidebar} />
            <div className="homeContainer">
                <Sidebar showSidebar={showSidebar} />
                <Feed hideFeed={showSidebar} />
                <Rightbar user={user} />
            </div>
        </>
    )
}

export default Home;