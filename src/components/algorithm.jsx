import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

async function loadPosts(user) {
  try {
    // Query all posts
    const postsQuery = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsQuery);
    const allPosts = postsSnapshot.docs.map((doc) => doc.data());

    console.log('All posts:', allPosts);

    // You can further filter posts based on user preferences or interactions
    // For simplicity, returning all posts for now
    return allPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    throw error;
  }
}

export default loadPosts;