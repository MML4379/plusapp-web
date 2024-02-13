import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/home';
import SignUpPage from './pages/signup';
import ProfilePage from './pages/profile';
import Navbar from './components/navbar';
import LoginPage from './pages/login';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PostPage from './pages/post';
import Post from './pages/viewpost';
import { NotFound } from './pages/notfound';
import { UserSettings } from './pages/settings';
import Messages from './pages/messages';

// MML+ Version 0.1

function App() {
    const [u] = useAuthState(auth);
    var uid = "ANONYMOUS";
    if (u) {
        uid = u.uid;
    }

    return(
        <div className='app'>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route path='/home' element={<HomeScreen user={uid} />} />
                    <Route path='/' element={<HomeScreen user={uid} />} />
                    <Route path='/signup' element={<SignUpPage />} />
                    <Route path='/u/:id' element={<ProfilePage />} />
                    <Route path='/profile/:id' element={<ProfilePage />} />
                    <Route path='/profilePage/:id' element={<ProfilePage />} />
                    <Route path='/plusAcc/:id' element={<ProfilePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/newpost' element={<PostPage user={uid} />} />
                    <Route path='/post/:postId' element={<Post />} />
                    <Route path='/v0.01.1/posts/post/:postId' element={<Post />} />
                    <Route path='/settings' element={<UserSettings />} />
                    <Route path='/messages' element={<Messages />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;