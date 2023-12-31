import React, { useState, useEffect } from 'react';
import loadPosts from '../components/algorithm';
import { auth, db } from '../firebase';
import MakePost from '../components/makepost';
import { AuthorInfo } from '../components/userinfo';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, onSnapshot, collection, addDoc, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import ChristmasCountdown from '../components/christmasCountdown';
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
    uid = 'NO UID';
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
      const updatedLikes = likes + 1;

      await updateDoc(postRef, {
        'details.likes': updatedLikes
      });

      console.log('Liked post');

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
  
      console.log('Added comment');
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
      console.log('Fetched comments:', commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const getCommentCount = (postId) => {
    return comments.filter(comment => comment.postId === postId).length || 0;
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

  return (
    <div className={`nfdjkd ${showCommentsModal ? 'show-modal' : ''}`}>
      <h1>Home</h1>
      <MakePost />
      {posts.length > 0 ? (
  <div className='postList'>
    <ChristmasCountdown />
    {posts.map((post) => (
      <div className='post' data-mmlid={post.id} key={post.id}>
        <header className='postHeader'>
          <AuthorInfo uid={post.details.author} />
        </header>
        <main className='postBody'>{post.details.text}</main>
        <br />
        <footer className='postButtons'>
          <button className='plus-button --lg_button' onClick={() => handleLike(post.id)}>
            <FontAwesomeIcon icon='fa-solid fa-thumbs-up' /> {likesMap[post.id] || post.details.likes}
          </button>
          <button className='plus-button --lg_button' onClick={() => openCommentsModal(post.id)}>
            <FontAwesomeIcon icon='fa-solid fa-comment' />
          </button>
          <button className='plus-button --lg_button'><FontAwesomeIcon icon='fa-solid fa-share' /></button>
          <button className='plus-button --lg_button' onClick={() => window.location.replace(`/post/${post.id}`)}>
            <FontAwesomeIcon icon='fa-solid fa-arrow-up-right-from-square' />
          </button>
        </footer>
      </div>
    ))}
  </div>
) : (
  <p>No posts available</p>
)}

{/* Comments Modal */}
<div className={`overlay ${showCommentsModal ? 'show-modal' : ''}`} onClick={closeCommentsModal}></div>
<div className={`modal ${showCommentsModal ? 'show-modal' : ''}`}>
  <div className="modal-content">
    <span className="close" onClick={closeCommentsModal}>&times;</span>
    {/* Comment Form */}
    <form onSubmit={(e) => {
      e.preventDefault();
      handleAddComment();
    }}>
      <input type="text" className='commentField' value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" />
      <button className='plus-button --lg_button --margin8l' type="submit">Post</button>
    </form>
    {/* Render comments */}
    <div className="comments">
      <strong>{getCommentCount()}</strong>
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment, index) => (
          <>
          <div key={index} className="comment">
            <AuthorInfo uid={comment.author} />
            <p>{comment.text}</p>
          </div><br /></>
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