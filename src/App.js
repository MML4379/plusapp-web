import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topnav from './components/topnav';
import Index from './pages';
import Sidenav from './components/sidenav';
import Messages from './pages/messages';

function App() {
    return(
        <div className='app'>
            <div role='navigation' data-mmljsname='plusnav'>
                <Topnav />
                <Sidenav />
            </div>
            <div role='application' data-mmljstype='router'>
                <BrowserRouter>
                    <Routes>
                        <Route path='/home' Component={Index} />
                        <Route path='/' Component={Index} />
                        <Route path='/index' Component={Index} />
                        <Route path='/messages' Component={Messages} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}



export default App;