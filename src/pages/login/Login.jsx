import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress, LinearProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { dispatch, isFetching } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login as a test user
  const getTestUser = (async () => {
    loginCall(
      { email: "testuser@gmail.com", password: "123456" },
      dispatch
    );
  })

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <>
      {isFetching &&
        <LinearProgress />
      }
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <div className="namaskaramTitle">
              <h3 className="loginLogo">
                Namaskaram
              </h3>
              <img src='/assets/namaste_icon.png' alt='#logo' className='loginNamasteIcon' />
            </div>

            <span className="loginDesc">
              Connect with friends and the world around you on Namaskaram.
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <h1>Already Registered?</h1>
              <Link onClick={() => getTestUser()} className="testUserLogin">Login as a test user!</Link>
              <input
                placeholder="Email"
                type="email"
                required
                className="loginInput"
                ref={email}
              />
              <input
                placeholder="Password"
                type="password"
                required
                minLength="6"
                className="loginInput"
                ref={password}
              />
              <button className="loginButton" type="submit" disabled={isFetching}>
                {isFetching ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Log In"
                )}
              </button>
              <button className="loginRegisterButton" onClick={() => navigate('/register')}>
                Create a New Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
