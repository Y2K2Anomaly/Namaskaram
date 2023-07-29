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

    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    useEffect(() => {
        const submitPicture = async () => {
            const newUser = {
                userId: user?._id,
            }

            if (file1) {
                const data = new FormData();
                const file1Name = Date.now() + file1.name;
                data.append("name", file1Name);
                data.append("file", file1);
                newUser.userImg = file1Name;
                try {
                    await axios.post("/upload", data);
                } catch (err) {
                    console.log("failed to upload data")
                }
            }
            if (file2) {
                const data = new FormData();
                const file2Name = Date.now() + file2.name;
                data.append("name", file2Name);
                data.append("file", file2);
                newUser.coverImg = file2Name;
                try {
                    await axios.post("/upload", data);
                } catch (err) {
                    console.log("failed to upload data")
                }
            }

            try {
                await axios.put(`/users/profile/${username}`, newUser)
                window.location.reload()
            } catch (err) {
                console.log("Put failed to upload")
            }
        }

        submitPicture();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file1, file2])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);

    return (
        <>
            <Topbar currentUser={user} />
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
                            {
                                user.isAdmin && <div className="addCoverButton">
                                    <IconButton>
                                        <AddAPhoto sx={{ fontSize: 35, color: "gray" }} />
                                    </IconButton>
                                    <input
                                        name="file2"
                                        type="file"
                                        id="file2"
                                        accept=".png, .jpeg, .jpg"
                                        onChange={(e) => setFile2(e.target.files[0])}
                                        className="coverButtonInput"
                                    />
                                </div>
                            }
                            <div className="profileUserImg">
                                <img

                                    src={
                                        user.profilePicture
                                            ? PF + user.profilePicture
                                            : PF + "person/noAvatar.png"
                                    }
                                    alt=""
                                />
                                {
                                    user.isAdmin && <div className="addImageButton">
                                        <IconButton>
                                            <AddAPhoto color="success" sx={{ fontSize: 28 }} />
                                        </IconButton>
                                        <input
                                            name="file1"
                                            type="file"
                                            id="file1"
                                            accept=".png, .jpeg, .jpg"
                                            onChange={(e) => setFile1(e.target.files[0])}
                                            className="userButtonInput"
                                        />
                                    </div>
                                }
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