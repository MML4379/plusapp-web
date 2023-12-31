import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import "../css/navbar.css"
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMessage, faUsersRectangle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
const pluslogo = require("../assets/christmas-plus23.png");
library.add(faHouse, faMessage, faUsersRectangle, faPlusCircle);
var profileLink;
var uid;
const soundToPlay = require("../assets/bells.mp3");

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [audio] = useState(new Audio(soundToPlay));

  const playSound = () => {
    audio.play();
  };

  if (user) {
    uid = user.uid;
    profileLink = `/u/${uid}`;
  }else {
    uid = "NO UID!";
    profileLink = "/login";
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          // Get additional user information from Firestore
          const userData = docSnapshot.data();
          setUserData({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            handle: userData?.handle || '',
            coins: userData?.coins || 0,
          });
        });

        return () => unsubscribe(); // Cleanup function
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="navbar">
      {/* Left side buttons */}
      <div className="navbar-left">
        
        <div className='navbar-links'>
          <img src={pluslogo} alt="+" className="navbar-logo" onClick={() => playSound()} />
          <a className='navbar-link' href="/"><FontAwesomeIcon icon='fa-solid fa-house' /></a>
          <a className='navbar-link' href="/messages"><FontAwesomeIcon icon='fa-solid fa-message' /></a>
          <a className='navbar-link' href="/boards"><FontAwesomeIcon icon='fa-solid fa-users-rectangle' /></a>
          <a className='navbar-link' href="/newpost"><FontAwesomeIcon icon='fa-solid fa-plus-circle' /></a>
        </div>
      </div>

      {/* Right side user bubble or sign-in button */}
      <div className="navbar-right">
        {user ? (
          // Show user bubble if user is signed in
          <div className="desktop-user-bubble">
            <div className='user-bubble-name'>
              {userData ? (
                <div>
                  <strong className='user-fullname'>{userData.firstName} {userData.lastName}</strong>
                  <p className='user-handle'><a href={profileLink}>@{userData.handle}</a></p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
        ) : (
          // Show sign-in button if user is not signed in
          <button className='plus-button --lg_button'><a href='/login'>Log In</a></button>
        )}
      </div>
    </div>
  );
};

export default Navbar;