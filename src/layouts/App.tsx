import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Login = loadable(() => import('../pages/Login'));
const SignUp = loadable(() => import('../pages/SignUp'));
const Channels = loadable(() => import('../pages/Channels'));
const DirectMessage = loadable(() => import('../pages/DirectMessage'));

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="workspace" element={<Channels />}>
                    <Route path="channel" element={<Channels />}>
                        <Route path=":channelId" element={<Channels />} />
                    </Route>
                    <Route path="dm" element={<DirectMessage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
