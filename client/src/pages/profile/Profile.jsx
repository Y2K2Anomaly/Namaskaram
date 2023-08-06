import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AddAPhoto } from '@mui/icons-material';
import { IconButton } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";


export default function Profile() {
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const { username } = useParams();

    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchUser();
    }, [username]);

    const submitPicture = async () => {
        const newUser = {
            userId: user?._id,
            profilePicture: {
                url: '',
                public_id: ''
            },
            coverPicture: {
                url: '',
                public_id: ''
            }
        }

        if (file1) {
            const data = new FormData();
            data.append("file", file1);

            try {
                const res = await axios.post("/upload", data);
                newUser.profilePicture.url = res.data.imageUrl;
                newUser.profilePicture.public_id = res.data.publicId;
                setFile1(null);
            } catch (err) {
                console.log("failed to upload data")
            }
        }
        if (file2) {
            const data = new FormData();
            data.append("file", file2);

            try {
                const res = await axios.post("/upload", data);
                newUser.coverPicture.url = res.data.imageUrl;
                newUser.coverPicture.public_id = res.data.publicId;
                setFile2(null);
            } catch (err) {
                console.log("failed to upload data")
            }
        }

        try {
            await axios.put(`/users/profile/${currentUser.username}`, newUser)
            window.location.reload()
        } catch (err) {
            console.log("Put failed to upload")
        }
    }

    const handlePictureUpload = () => {
        if (file1 || file2) {
            submitPicture();
        }
    };

    const onDeleteClick = async ({ pictureType }) => {
        try {
            if (pictureType === 'profilePicture') {
                await axios.delete(`/upload/${user.profilePicture.public_id}`);
                const res = await axios.put(`/users/picture/${currentUser.username}`, user);
                console.log(res.data);
            } else if (pictureType === 'coverPicture') {
                await axios.delete(`/upload/${user.coverPicture.public_id}`);
                const res = await axios.put(`/users/cover/picture/${currentUser.username}`, user);
                console.log(res.data);
            }

            // Updating the local user state after deletion
            setUser((prevUser) => ({
                ...prevUser,
                [pictureType]: {
                    url: '',
                    public_id: '',
                },
            }));

            window.location.reload();
        } catch (err) {
            console.warn(err);
        }
    };


    // optionsButton
    const [userBtnOpen, setUserBtnOpen] = useState(false);
    const [coverBtnOpen, setCoverBtnOpen] = useState(false);

    const userHandleClick = () => {
        setUserBtnOpen(!userBtnOpen);
    };
    const coverHandleClick = () => {
        setCoverBtnOpen(!coverBtnOpen);
    };

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
                                src={file2 ? URL.createObjectURL(file2) : (user?.coverPicture?.url || "/assets/noCover.png")}
                                alt="_img"
                            />
                            {
                                currentUser.username === username && <div className="addCoverButton" onClick={coverHandleClick}>
                                    <IconButton>
                                        <AddAPhoto sx={{ fontSize: 35, color: "gray" }} />
                                        <input
                                            name="file2"
                                            type="file"
                                            id="file2"
                                            accept=".png, .jpeg, .jpg"
                                            onChange={(e) => setFile2(e.target.files[0])}
                                            className="coverButtonInput"
                                        />
                                    </IconButton>
                                    {
                                        coverBtnOpen && (
                                            <ul className="coverOptionButton">
                                                <li onClick={handlePictureUpload}>{!file2 ? "Upload" : "Save"}</li>
                                                <hr />
                                                <li onClick={() => onDeleteClick({ pictureType: 'coverPicture' })}>Remove</li>
                                            </ul>
                                        )
                                    }

                                </div>
                            }
                            <div className="profileUserImg">
                                <div className="userImg">


                                    <img

                                        src={file1 ? URL.createObjectURL(file1) : (user?.profilePicture?.url || "/assets/noAvatar.png")}
                                        alt="_img"
                                    />
                                    {
                                        currentUser.username === username && <div className="addImageButton" onClick={userHandleClick}>
                                            <IconButton>
                                                <AddAPhoto color="success" sx={{ fontSize: 28 }} />
                                                <input
                                                    name="file1"
                                                    type="file"
                                                    id="file1"
                                                    accept=".png, .jpeg, .jpg"
                                                    onChange={(e) => setFile1(e.target.files[0])}
                                                    className="coverButtonInput"
                                                />
                                            </IconButton>

                                            {
                                                userBtnOpen && (
                                                    <div>
                                                        <ul className="optionsButtonContainer">
                                                            <li onClick={handlePictureUpload}>{!file1 ? "Upload" : "Save"}
                                                            </li>
                                                            <hr />
                                                            <li onClick={() => onDeleteClick({ pictureType: 'profilePicture' })}>Remove</li>
                                                        </ul>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    }
                                </div>
                                <div className="profileInfo">
                                    <h4 className="profileInfoName">{user.name}</h4>
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