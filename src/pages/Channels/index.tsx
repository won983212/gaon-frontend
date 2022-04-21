import Workspace from '@/layouts/Workspace';
import { getChannelNameById } from '@/utils/channelManager';
import React from 'react';
import { useParams } from 'react-router';
import { Header } from './style';

function Channels() {
    const { channelId } = useParams();
    const channelNum = channelId ? +channelId : 0;
    return (
        <Workspace>
            <Header>{getChannelNameById(channelNum)}</Header>
        </Workspace>
    );
}

export default Channels;
