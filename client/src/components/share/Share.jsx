import React, { useEffect, useContext, useState } from 'react';
import "./share.css";
import { PermMedia, Cancel, EmojiEmotions } from "@mui/icons-material";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Share = ({ onPostShare }) => {

    const { user: currentUser } = useContext(AuthContext);
    const [sameUser, setSameUser] = useState('');
    const [desc, setDesc] = useState('');
    const [isPickerVisible, setPickerVisible] = useState(false);

    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?username=${currentUser?.username}`);
            setSameUser(res.data)
        };
        fetchUser();
    }, [currentUser?.username]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: currentUser._id,
            desc: desc
        };

        if (file) {
            const data = new FormData();
            data.append("file", file);

            try {
                // Uploading the image to Cloudinary
                const res = await axios.post("/upload", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                newPost.img = {
                    url: res.data.imageUrl,
                    public_id: res.data.publicId
                };

            } catch (err) {
                console.log("Failed to upload data", err);
                return;
            }
        }

        try {
            // Creating a new post with the Cloudinary image URL and public_id
            const createdPost = await axios.post("/posts", newPost);
            setFile(null);
            setDesc('');
            onPostShare(createdPost.data); // Passing the created post data to the parent component
        } catch (err) {
            console.log("Post failed to upload", err);
        }
    };


    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className='shareProfileImg' src={sameUser?.username === currentUser.username ? (sameUser?.profilePicture?.url || "/assets/noAvatar.png") : "/assets/noAvatar.png"} alt="" />
                    <input
                        type="text"
                        className="shareInput"
                        placeholder={`What's in your mind ${currentUser.name} ?`}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>

                <hr className="shareHr" />

                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                    </div>
                )}
                <form
                    className="shareBottom"
                    onSubmit={submitHandler}
                    encType="multipart/form-data"
                >
                    <div className="shareOptions">
                        <label htmlFor='file' className="shareOption">
                            <PermMedia
                                htmlColor='tomato'
                                className="shareIcon" />
                            <span className='shareOptionText'>Photo</span>
                            <input
                                style={{ display: "none" }}
                                name="file"
                                type="file"
                                id="file"
                                accept=".png, .jpeg, .jpg"
                                onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <div className="shareOption">
                            <div className="emojiPicker" onClick={() => setPickerVisible(!isPickerVisible)}>
                                <EmojiEmotions
                                    htmlColor='goldenrod'
                                    className="shareIcon" />
                                <span className='shareOptionText'>Feelings</span>
                            </div>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
                <div className={isPickerVisible ? 'd-block' : 'd-none'}>
                    <Picker
                        data={data}
                        preview="none"
                        onEmojiSelect={(e) => {
                            setDesc(e?.native)
                            setPickerVisible(!isPickerVisible)
                        }}
                        theme="light"
                    />
                </div>
            </div>
        </div>
    )
}

export default Share