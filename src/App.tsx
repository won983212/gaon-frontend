import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SelectWorkspace from '@/pages/SelectWorkspace';

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
                <Route path="/invite">
                    <Route path=":inviteId" element={<Invite />} />
                </Route>
                <Route path="workspace">
                    <Route index element={<SelectWorkspace />} />
                    <Route path=":workspaceId">
                        <Route path="channel">
                            <Route index element={<Channels />} />
                            <Route path=":channelId" element={<Channels />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
