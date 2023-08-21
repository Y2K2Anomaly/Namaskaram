import React, { useContext, useEffect, useRef, useState } from 'react';
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { LinearProgress, IconButton } from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {

    const name = useRef('');
    const [username, setUsername] = useState('');
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const city = useRef();
    const from = useRef();
    const dateOfBirth = useRef();
    const bio = useRef();
    const relationship = useRef();
    const navigate = useNavigate();


    // Login as a test_user
    const { dispatch, isFetching } = useContext(AuthContext);

    const getTestUser = (async () => {
        loginCall(
            { email: "testuser@gmail.com", password: "123456" },
            dispatch
        );
    })

    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');

    const [isValid, setIsValid] = useState(true)

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        const regexPattern = /^@[a-z0-9]+(_[a-z0-9]+)*$/;
        setIsValid(regexPattern.test(value) && !/\s/.test(value));

        setUsername(value);
    };

    useEffect(() => {
        const submitPicture = async () => {

            if (file) {
                const data = new FormData();
                data.append("file", file);

                try {
                    const res = await axios.post("/upload", data);
                    setProfilePicture(res.data)
                } catch (err) {
                    console.log("failed to upload data")
                }
            }
        }

        submitPicture();
    }, [file])

    const handleClick = async (e) => {
        e.preventDefault();

        if (passwordAgain.current.value !== password.current.value) {
            password.current.setCustomValidity("Password don't match")
        } else {
            const user = {
                name: name.current.value,
                username: username,
                desc: bio.current.value,
                city: city.current.value,
                from: from.current.value,
                relationship: relationship.current.value,
                email: email.current.value,
                dateOfBirth: dateOfBirth.current.value,
                password: password.current.value,
                profilePicture: {
                    url: profilePicture.imageUrl,
                    public_id: profilePicture.publicId
                }
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
        <>
            {isFetching &&
                <LinearProgress />
            }
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
                            <Link onClick={() => getTestUser()} className='testUserLogin'
                            >Login as a test user!
                            </Link>
                            <div className='userImage'>
                                <img src={file ? URL.createObjectURL(file) : "assets/noAvatar.png"} alt="" />
                                <div className="addRegisterImageButton">
                                    <IconButton>
                                        <AddAPhoto color="primary" sx={{ fontSize: 28 }} />
                                        <input
                                            name="file"
                                            type="file"
                                            id="file"
                                            accept=".png, .jpeg, .jpg"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                            <input
                                type="text"
                                className="registerInput"
                                placeholder="Name"
                                ref={name}
                                required
                            />
                            <input
                                type="text"
                                className="registerInput"
                                placeholder="@username"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            {!isValid && (
                                <div style={{ color: 'red' }}>
                                    Username must contain only small letters, numbers, or the special characters like ' @ ', ' _ ' and should starts with ' @ '. It does not start with ' _ ' or have ' _ ' after the ' @ '. (no spaces allowed)
                                </div>
                            )}
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
                            <strong>DOB:</strong>
                            <input
                                type="date"
                                className="registerInput"
                                placeholder="Date of Birth"
                                ref={dateOfBirth}
                                required
                            />
                            <input
                                type="text"
                                className="registerInput"
                                placeholder="Relationship eg. 1 - 2 - 3"
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
            </div >
        </>
    )
}

export default Register;