/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import "../css/sidenav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faMessage, faUsersRectangle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth } from "./plusdb";
library.add(faHouse, faMessage, faUsersRectangle, faMagnifyingGlass, faGoogle);
const logo = require('../assets/plus.png');


function Sidenav() {
    const [user] = useAuthState(auth);
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };
    
    const SignInButton = () => {
        return(
            <div className="signInNav">
                <button onClick={googleSignIn()} className="signInButton">
                    <FontAwesomeIcon icon='fa-brands fa-google' />
                    <span>Sign In</span>
                </button>
            </div>
        )
    };
    
    return(
        <div className="S22Ftd">
            <img className="j180G8" src={logo} alt='' />
            <br />
            <div className='navLinks'>
                <a className="navlink" href='/home'>
                    <FontAwesomeIcon className="smallScreen" icon='fa-solid fa-house' />
                </a>
                <br />
                <a className="navlink" href='/messages'>
                    <FontAwesomeIcon className="smallScreen" icon='fa-solid fa-message' />
                </a>
                <br />
                <a className="navlink" href='/groups'>
                    <FontAwesomeIcon className="smallScreen" icon='fa-solid fa-users-rectangle' />
                </a>
            </div>
            <div className="userIcon">
                <SignInButton />
            </div>
        </div>
    );
}



export default Sidenav;