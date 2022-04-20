import React from 'react';
import loadable from '@loadable/component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IconContext } from 'react-icons';

const Login = loadable(() => import('../pages/Login'));
const SignUp = loadable(() => import('../pages/SignUp'));
const Channel = loadable(() => import('../pages/Channel'));
const DirectMessage = loadable(() => import('../pages/DirectMessage'));

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="workspace" element={<Channel />}>
                    <Route path="channel" element={<Channel />}>
                        <Route path=":channelId" element={<Channel />}/>
                    </Route>
                    <Route path="dm" element={<DirectMessage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
