import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AddAPhoto } from '@mui/icons-material';
import { IconButton } from "@mui/material";

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const { username } = useParams();

    const [file, setFile] = useState(null);

    useEffect(() => {
        const submitPicture = async () => {
            const newUser = {
                userId: user._id,
            }

            if (file) {
                const data = new FormData();
                const fileName = Date.now() + file.name;
                data.append("name", fileName);
                data.append("file", file);
                newUser.img = fileName;
                console.log(newUser);
                try {
                    await axios.post("/upload", data);
                } catch (err) {
                    console.log("failed to upload data")
                }
            }

            try {
                await axios.put("/users/profile/:username", newUser)
                window.location.reload()
            } catch (err) {
                console.log("Put failed to upload")
            }
        }
        submitPicture();
    }, [file, user?.id])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">

                        <div className="profileCover">
                            <img
                                className="profileCoverImg"
                                src={
                                    user.coverPicture
                                        ? PF + user.coverPicture
                                        : PF + "person/noCover.png"
                                }
                                alt=""
                            />
                            <div className="profileUserImg">
                                <img

                                    src={
                                        user.profilePicture
                                            ? PF + user.profilePicture
                                            : PF + "person/noAvatar.png"
                                    }
                                    alt=""
                                />
                                <div className="addImageButton">
                                    <IconButton>
                                        <AddAPhoto color="success" sx={{ fontSize: 28 }} />
                                    </IconButton>
                                    <input
                                        name="file"
                                        type="file"
                                        id="file"
                                        accept=".png, .jpeg, .jpg"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                                <div className="profileInfo">
                                    <h4 className="profileInfoName">{user.username}</h4>
                                    <span className="profileInfoDesc">{user.desc}</span>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </>
    );
}