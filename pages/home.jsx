import React, { useState, useEffect } from 'react';
import loadPosts from '../components/recommend';
import { auth, db } from '../firebase';
import MakePost from '../components/makepost';
import { AuthorInfo } from '../components/userinfo';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, onSnapshot, collection, addDoc, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import '../css/main.css';
import { faThumbsUp, faComment, faShare, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
library.add(faThumbsUp, faComment, faShare, faArrowUpRightFromSquare);

const HomeScreen = () => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [likesMap, setLikesMap] = useState({});
  const [comments, setComments] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  var uid;
  document.title = "MML+ • Home";

  if (!auth || !user) {
    uid = 'anonymous';
  } else {
    uid = user.uid;
  }

  useEffect(() => {
    const fetchData = async () => {
      const postsData = await loadPosts(uid);
      setPosts(postsData);

      const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          details: doc.data().details,
          // other post data if needed
        }));
        setPosts(updatedPosts);
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    };

    fetchData();
  }, [uid]);

  const handleLike = async (postId) => {
    const postRef = doc(db, 'posts', postId);

    try {
      const postSnapshot = await getDoc(postRef);
      const postDetails = postSnapshot.data()?.details || {};
      const likes = postDetails.likes || 0;

      // If not liked, update the like count and add user to likedBy list
      const updatedLikes = likes + 1;
      await updateDoc(postRef, {
        'details.likes': updatedLikes
      });

      setLikesMap((prevLikesMap) => ({
        ...prevLikesMap,
        [postId]: updatedLikes
      }));
    } catch (error) {
      console.error('Error liking post: ', error);
    }
};

  const handleAddComment = async () => {
    try {
      const commentsRef = collection(db, 'posts', selectedPostId, 'comments');
      await addDoc(commentsRef, {
        text: commentText,
        author: uid,
        postId: selectedPostId, // Add postId to the comment object
      });

      // Clear the comment text and hide the modal after adding a comment
      setCommentText('');
      setShowCommentsModal(false);
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const commentsSnapshot = await getDocs(commentsRef);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        postId: postId, // Include postId in each comment
        ...doc.data(),
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const openCommentsModal = (postId) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
    fetchComments(postId); // Fetch comments when opening the modal
  };

  const closeCommentsModal = () => {
    setSelectedPostId('');
    setShowCommentsModal(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const checkUidState = () => {
    if (uid === null || uid === "anonymous") {
      return false;
    }else {
      return true;
    }
  }

  return (
    <div className={`nfdjkd ${showCommentsModal ? 'show-modal' : ''}`}>
      <h1>Home</h1>
      <MakePost />
      {posts.length > 0 ? (
  <div className='postList'>
    {posts.map((post) => (
      <div className='post' data-mmlid={post.id} key={post.id}>
        {post.details && post.details.author ? ( // Check if details and author are defined
          <>
            <header className='postHeader'>
              <AuthorInfo uid={post.details.author} />
              <br />
              <p>Posted on: <strong>{formatTimestamp(post.details.timePosted)}</strong></p>
            </header>
            <br />
            <main className='postBody'>{post.details.text}</main>
            <br />
            <footer className='postButtons'>
              <button className='plus-button' onClick={() => handleLike(post.id)}>
                <FontAwesomeIcon icon='fa-solid fa-thumbs-up' /> {likesMap[post.id] || post.details.likes}
              </button>
              <button className='plus-button' onClick={() => openCommentsModal(post.id)}>
                <FontAwesomeIcon icon='fa-solid fa-comment' /> Comments
              </button>
              <button className='plus-button'>
                <FontAwesomeIcon icon='fa-solid fa-share' /> Share (BETA)
              </button>
              <button className='plus-button' onClick={() => window.location.replace(`/post/${post.id}`)}>
                <FontAwesomeIcon icon='fa-solid fa-arrow-up-right-from-square' /> Open in page
              </button>
            </footer>
          </>
        ) : (
          <p>Error: Missing post details or author</p> // Display error message if details or author are missing
        )}
      </div>
    ))}
    <br />
    <div className='footerSection'>
      <p>There's nothing else to see. (<em onClick={() => {window.location.reload();}}>try refreshing the feed!</em>)</p>
      <br />
      <strong>MML+ Web App - Version 0.1.2 - Copyright © 2024 MML Tech LLC</strong>
    </div>
  </div>
  
) : (
  <div className='nfdjkd'>
    <h1>Well that wasn't supposed to happen!</h1>
    <p>Nothing is loading! Check your internet connection or the MML+ status page, and try again.</p>
  </div>
)}

{/* Comments Modal */}
<div className={`overlay ${showCommentsModal ? 'show-modal' : ''}`} onClick={closeCommentsModal}></div>
<div className={`modal ${showCommentsModal ? 'show-modal' : ''}`}>
  <div className="modal-content">
    <span className="close" onClick={closeCommentsModal}>&times;</span>
    {/* Comment Form - Add conditional rendering based on the presence of UID */}
    {checkUidState ? (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddComment();
      }}>
        <input type="text" className='commentField' value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" />
        <button className='plus-button --lg_button --margin8l' type="submit">Post</button>
      </form>
    ) : (
      <p>Please log in to post comments.</p>
    )}
    {/* Render comments */}
    <div className="comments">
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment, index) => (
          <React.Fragment key={index}>
            <div className="comment">
              <AuthorInfo uid={comment.author} />
              <p>{comment.text}</p>
            </div>
            <br />
          </React.Fragment>
        ))
      ) : (
        <strong>No Comments</strong>
      )}
    </div>
  </div>
</div>
</div>
  );
};

export default HomeScreen;