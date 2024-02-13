/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import "../css/main.css"
import { AuthorInfo } from '../components/userinfo';
const userImg = require("../assets/default-user-img.png");

const ProfilePage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
  try {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setUserData(userDoc.data());
    } else {
      alert("User does not exist!");
      window.location.replace("/home");
    }
  } catch (error) {
    console.error("Error getting user data: " + error);
  }
};
    fetchUserData();
  }, [id])

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp.seconds * 1000);
    if (isNaN(date.getTime())) return 'N/A';

    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const finishedProduct = date.toLocaleDateString(undefined, options);
    if (
      finishedProduct === "1/2/2023" || "3/19/2010" || "12/15/2023" || "12/16/2023" || "12/17/2023" || "12/18/2023" || "12/19/2023" || "12/20/2024"
    ) {
      return (
        <p>This user has been around for a while; They joined on {finishedProduct}, when MML+ was first announced!</p>
      );
    } else {
      return(
        <p>Joined MML+ on {finishedProduct}.</p>
      )
    }
  };

  const handleFollow = async () => {}

  return (
    <div className="jkgsul">
      {userData ? (
        <>
          <div className="profileHeader">
            <img src={userImg} alt="ProfileImg" className='userPfp' />
            <div className='profileInfo'>
              <h1 className='profile-fullName'>{userData.firstName} {userData.lastName}</h1>
              <strong>@{userData.handle}</strong>
              <span>{formatDate(userData.joinDate)}</span>
              <br />
              <p>{userData.bio || "No bio yet!"}</p>
            </div>
            <div className='profileButtons'>
              <button className='plus-button'>Follow</button>
              <br />
              <button className='plus-button'>Add Friend</button>
            </div>
          </div>
          <div className="profile-content">
            {userData.posts && userData.posts.length > 0 ? (
            <div className='postList'>
            </div>
          ) : (
            <strong>This user hasn't posted anything.</strong>
          )}
        </div>
        </>
      ) : (
        <div className="jkgsul">
          <p>Loading content...</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;