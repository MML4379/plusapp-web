import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { AuthorInfo } from '../components/userinfo';
import { db, auth } from '../firebase';
import '../css/main.css';
import { faThumbsUp, faShare, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useAuthState } from 'react-firebase-hooks/auth';
library.add(faThumbsUp, faShare, faArrowUpRightFromSquare);
var uid;

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [likesMap, setLikesMap] = useState({});
  const [user] = useAuthState(auth);

  if (user) {
    uid = user.uid;
  } else {
    uid = 'NO UID';
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          setPost(postDoc.data());
          fetchComments(); // Fetch comments when the post is loaded
          document.title=`MML+ • Post`
        } else {
          console.error('Post not found.');
        }
      } catch (error) {
        console.error('Error fetching post:', error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const commentsSnapshot = await getDocs(commentsRef);
      const commentsData = commentsSnapshot.docs.map(doc => doc.data());
      console.log('Fetched comments:', commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        text: commentText,
        author: uid
      });

      console.log('Added comment');
      // Clear the comment text after adding a comment
      setCommentText('');
      // Fetch comments again after adding a new comment
      fetchComments();
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div className='ucniga'>
      <div className='post' data-mmlid={post.id} key={post.id}>
        <header className='postHeader'>
          <AuthorInfo uid={post.details.author} />
        </header>
        <main className='postBody'>{post.details.text}</main>
        <br />
        <footer className='postButtons-reduced'>
          <button className='plus-button --lg_button' onClick={handleLike}>
            <FontAwesomeIcon icon='fa-solid fa-thumbs-up' /> {likesMap[postId] || post.details.likes}
          </button>
          <button className='plus-button --lg_button'>
            <FontAwesomeIcon icon='fa-solid fa-share' /> 0
          </button>
        </footer>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleAddComment}>
        <input
          type='text'
          className='commentField'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder='Add a comment'
        />
        <button className='plus-button --margin8l' type='submit'>
          Post
        </button>
      </form>

      {/* Render comments */}
      <div className='comments'>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className='comment'>
              <AuthorInfo uid={comment.author} />
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <strong>No Comments</strong>
        )}
      </div>
    </div>
  );
};

export default Post;