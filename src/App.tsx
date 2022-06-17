import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Login = loadable(() => import('@/pages/Login'));
const SignUp = loadable(() => import('@/pages/SignUp'));
const Invite = loadable(() => import('@/pages/Invite'));
const Channels = loadable(() => import('@/pages/Workspace'));

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/invite" element={<Invite />}>
                    <Route path=":inviteId" element={<Invite />} />
                </Route>
                <Route path="workspace" element={<Channels />}>
                    <Route path=":workspaceId" element={<Channels />}>
                        <Route path="channel" element={<Channels />}>
                            <Route path=":channelId" element={<Channels />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
