import React from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import { FlexLayout } from '@/pages/Channels/Conference/style';
import useChannel from '@/hooks/useChannel';

export default function TabCodeShare() {
    const { data: channelInfo } = useChannel();
    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            Whiteboard Sharing
        </FlexLayout>
    );
}
