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
import Snowfall from 'react-snowfall';
import { NotFound } from './pages/notfound';

// MML+ Version 0.1

function App() {
    console.info("Please close this console if you do not know what you are doing. Any exploit to purposefully get a user banned or to exploit the coins system WILL get you banned.");
    console.info("MML+ version 0.1, Copyright (C) 2023 MML Tech LLC - https://mmltech.net");
    const [u] = useAuthState(auth);
    var uid = "ANONYMOUS";
    if (u) {
        uid = u.uid;
    }
    

    return(
        <div className='app'>
            <Snowfall
                style={{
                    position: 'fixed',
                    width: '100vw'
                }}
                snowflakeCount={100}
                radius={[0.5,4]}
                wind={[0.5,2]}
                speed={[0.5,2]}
            />
            <Navbar />
            <BrowserRouter basename={process.env.PUBLIC_URL}>
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
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;