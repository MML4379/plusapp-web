import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import "../css/main.css"
const userImg = require("../assets/default-user-img.png");

export const AuthorInfo = ({ uid }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('User not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [uid]);

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className='userInfo'>
      <img src={userImg} alt='profileImg' className='feedUserPfp' />
      <div className='userInfoText'>
        <h3 className='authorName'>{userData.firstName} {userData.lastName}</h3>
        <strong className='authorHandle' onClick={() => window.open(`/u/${uid}`)}>@{userData.handle}</strong>  
      </div>     
    </div>
  );
};