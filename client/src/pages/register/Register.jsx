import React, { useEffect, useRef, useState } from 'react';
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IconButton } from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";

const Register = () => {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const city = useRef();
    const from = useRef();
    const bio = useRef();
    const relationship = useRef();
    const navigate = useNavigate();

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const submitPicture = async () => {

            if (file) {
                const data = new FormData();
                const fileName = Date.now() + file.name;
                data.append("name", fileName);
                data.append("file", file);
                try {
                    await axios.post("/upload", data);
                } catch (err) {
                    console.log("failed to upload data")
                }
                setProfilePicture(fileName);
            }
        }

        submitPicture();
    }, [file])
    console.log(profilePicture)

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            password.current.setCustomValidity("Password don't match")
        } else {
            const user = {
                username: username.current.value,
                desc: bio.current.value,
                city: city.current.value,
                from: from.current.value,
                relationship: relationship.current.value,
                email: email.current.value,
                password: password.current.value,
                profilePicture: profilePicture
            }
            try {
                await axios.post("/auth/register", user)
                navigate("/login")
            } catch (err) {
                console.log(err)
            }
        }
    };

    return (
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <div className="namaskaramTitle">
                        <h3 className="loginLogo">
                            Namaskaram
                        </h3>
                        <img src='/assets/namaste_icon.png' alt='#logo' className='loginNamasteIcon' />
                    </div>
                    <span className='registerDesc'>Connect with friends and the world around you on Namaskaram.</span>
                </div>
                <div className="registerRight">
                    <form className="registerBox" onSubmit={handleClick}>
                        <h1>Register Account</h1>
                        <div className='userImage'>
                            <img src={profilePicture ? PF + profilePicture : PF + "person/noAvatar.png"} alt="" />
                            <div className="addImageButton">
                                <IconButton>
                                    <AddAPhoto color="primary" sx={{ fontSize: 28 }} />
                                </IconButton>
                                <input
                                    name="file"
                                    type="file"
                                    id="file"
                                    accept=".png, .jpeg, .jpg"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            className="registerInput"
                            placeholder="Username"
                            ref={username}
                            required
                        />
                        <input
                            type="text"
                            className="registerInput"
                            placeholder="Bio"
                            ref={bio}
                            required
                        />
                        <input
                            type="text"
                            className="registerInput"
                            placeholder="City"
                            ref={city}
                            required
                        />
                        <input
                            type="text"
                            className="registerInput"
                            placeholder="From"
                            ref={from}
                            required
                        />
                        <input
                            type="text"
                            className="registerInput"
                            placeholder="Relationship"
                            ref={relationship}
                            required
                        />
                        <input
                            type="email"
                            className="registerInput"
                            placeholder="Email"
                            ref={email}
                            required
                        />
                        <input
                            type="password"
                            className="registerInput"
                            placeholder="Password"
                            ref={password}
                            minLength="6"
                            required
                        />
                        <input
                            type="password"
                            className="registerInput"
                            placeholder="Password Again"
                            ref={passwordAgain}
                            required
                        />
                        <button
                            className="registerButton"
                            type='submit'
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </button>
                        <button
                            className="registerLoginButton"
                            onClick={() => navigate('/login')}
                        >
                            Log into Account
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register;