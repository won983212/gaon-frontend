import Workspace from '@/layouts/Workspace';
import React from 'react';
import { useParams } from 'react-router';

function Channels() {
    const { channelId } = useParams();
    return (
        <Workspace>
            <p>Hello</p>
        </Workspace>
    );
}

export default Channels;
