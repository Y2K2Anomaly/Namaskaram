import React, { useContext, useRef, useState } from 'react';
import "./share.css";
import { PermMedia, Cancel, Label, Room, EmojiEmotions } from "@mui/icons-material";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Share = () => {

    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const desc = useRef();

    const [file, setFile] = useState(null);

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }

        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;
            console.log(newPost);
            try{
                await axios.post("/upload", data);
            } catch(err) {
                console.log("failed to upload data")
            }
        }

        try {
            await axios.post("/posts", newPost)
            window.location.reload()
        } catch (err) {
            console.log("Post failed to upload")
        }
    }

    return (
        <div className='share'>
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className='shareProfileImg' src={
                        user.profilePicture ? PF + user.profilePicture : PF + 'person/noAvatar.png'
                    } alt="" />
                    <input
                        type="text"
                        className="shareInput"
                        placeholder={`What's in your mind ${user.username} ?`}
                        ref={desc}
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
                            <span className='shareOptionText'>Photo or Video</span>
                            <input
                                style={{ display: "none" }}
                                name="file"
                                type="file"
                                id="file" 
                                accept=".png, .jpeg, .jpg"
                                onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <div className="shareOption">
                            <Label
                                htmlColor='blue'
                                className="shareIcon" />
                            <span className='shareOptionText'>Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room
                                htmlColor='green'
                                className="shareIcon" />
                            <span className='shareOptionText'>Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions
                                htmlColor='goldenrod'
                                className="shareIcon" />
                            <span className='shareOptionText'>Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}

export default Share