import React, { useEffect } from 'react';
import Chatting from '@/pages/Channels/Chatting';
import Conference from '@/pages/Channels/Conference';
import Workspace from '@/layouts/Workspace';
import { IconContainer, NoChannelMessageWrapper } from '@/pages/Channels/style';
import { MdOutlineInsertEmoticon } from 'react-icons/all';
import useChannel from '@/hooks/useChannel';
import { useParams } from 'react-router';
import useSocket from '@/hooks/useSocket';

function Channels() {
    const { workspaceId, channelId } = useParams();
    const { data: channelInfo } = useChannel();
    const [socket] = useSocket(`/workspace-${workspaceId}`);

    let pageElement: JSX.Element = (
        <NoChannelMessageWrapper>
            <IconContainer>
                <MdOutlineInsertEmoticon />
            </IconContainer>
            <h2>채널을 선택해주세요!</h2>
        </NoChannelMessageWrapper>
    );

    if (channelInfo) {
        if (channelInfo.type === 'chatting') {
            pageElement = <Chatting />;
        } else {
            pageElement = <Conference />;
        }
    }

    useEffect(() => {
        socket.emit('channel', channelId);
    }, [channelId, socket]);

    return <Workspace>{pageElement}</Workspace>;
}

export default Channels;
