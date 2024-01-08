import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

async function loadPosts(user) {
  try {
    // Query every post from the collection
    const postsQuery = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsQuery); // Create a snapshot for those posts
    const allPosts = postsSnapshot.docs.map((doc) => doc.data()); // Put those posts into a JSON map

    // This just returns all posts, but in later versions, it will be filtered to specific genres.
    return allPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    throw error;
  }
}

export default loadPosts;