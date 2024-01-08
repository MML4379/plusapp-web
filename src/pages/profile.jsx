import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import "../css/main.css"
import { AuthorInfo } from '../components/userinfo';
const userImg = require("../assets/default-user-img.png");

const BadgeImages = {
  ogBadge: '../assets/og-badge.png',
  devBadge: '../assets/dev-badge.png',
  ultimateBadge: '../assets/ultimate-badge.png'
};

const ProfilePage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
  try {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setUserData(userDoc.data());

      // Fetch and display user posts
      const postsRef = collection(db, 'posts');
      const querySnapshot = await getDocs(query(postsRef, where('authorId', '==', id)));

      const userPosts = [];
      querySnapshot.forEach((postDoc) => {
        userPosts.push({ id: postDoc.id, ...postDoc.data() });
      });

      // Update state with user posts
      setUserData((prevUserData) => ({
        ...prevUserData,
        posts: userPosts,
      }));
    } else {
      alert("User does not exist!");
      window.location.replace("/home");
    }
  } catch (error) {
    alert("Error getting user data!");
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
      finishedProduct === "7/19/2023" ||
      finishedProduct === "12/15/2023" ||
      finishedProduct === "12/16/2023" ||
      finishedProduct === "12/17/2023" ||
      finishedProduct === "12/18/2023" ||
      finishedProduct === "12/19/2023"
    ) {
      return (
        <p>This user has been around for a while, they joined on {finishedProduct}, when MML+ was first announced!</p>
      );
    } else {
      return(
        <p>Joined MML+ on {finishedProduct}.</p>
      )
    }
  };

  const renderBadges = () => {
    return (
      <div className="badgeContainer">
        <h3>My badges (Beta)</h3>
        {userData.badges?.map((badgeId) => (
          <img
            key={badgeId}
            src={BadgeImages[badgeId]}
            alt={`Badge ${badgeId}`}
            style={{ width: '32px', height: '32px', marginRight: '8px' }}
            title={`${badgeId} badge - go to plus.mmltech.net/about/badges for more info`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="jkgsul">
      {userData ? (
        <>
          <div className="profileHeader">
            <img src={userImg} alt="ProfileImg" className='userPfp' />
            <div className='profileInfo'>
              <h1 className='profile-fullName'>{userData.firstName} {userData.lastName}</h1>
              <p>@{userData.handle}</p>
              <p>{formatDate(userData.joinDate)}</p>
              <br />
              <p>{userData.bio || "No bio yet!"}</p>
            </div>
            <div className='profileButtons'>
              <button className='plus-button --lg_button'>Follow</button>
            </div>
          </div>
          <div className="profile-content">
            {renderBadges()}
            <br />
            {userData.posts && userData.posts.length > 0 ? (
            <div className='postList'>
              {userData.posts.map((post) => (
                <div data-mmlid={post.id} data-plusapp-author={post.details.author} key={post.id} className='post'>
                  <div className='postHeader'>
                    <AuthorInfo uid={post.details.author} />
                  </div>
                  <br />
                  <main className='postBody'>
                    {post.details.text}
                  </main>
                  <br />
                  <footer className='postButtons'>
                    <p>Likes: {post.details.likes}</p>
                  </footer>
                </div>
              ))}
            </div>
          ) : (
            <strong>This user hasn't posted anything.</strong>
          )}
        </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;