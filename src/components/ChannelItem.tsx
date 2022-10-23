import { IChannel } from '@/types';
import React from 'react';
import { MdQuestionAnswer } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { HiOutlinePresentationChartLine } from 'react-icons/all';
import useRoom from '@/hooks/useRoom';

interface ChannelItemProps {
    channel: IChannel;
    onContextMenu?: (e: React.MouseEvent) => void;
}

function ChannelItem({ channel, onContextMenu }: ChannelItemProps) {
    const { workspaceId } = useRoom();
    return (
        <NavLink
            key={channel.id}
            to={`/workspace/${workspaceId}/channel/${channel.id}`}
            className={(navData) =>
                navData.isActive ? 'menuitem selected' : 'menuitem'
            }
        >
            <IconContainer>
                {channel.type === 'chatting' ? (
                    <MdQuestionAnswer />
                ) : channel.type === 'conference' ? (
                    <HiOutlinePresentationChartLine />
                ) : (
                    <></>
                )}
            </IconContainer>
            <p
                onContextMenu={(e: React.MouseEvent) =>
                    onContextMenu ? onContextMenu(e) : {}
                }
            >
                {channel.name}
            </p>
        </NavLink>
    );
}

const IconContainer = styled.div`
    margin-right: 8px;
`;

export default ChannelItem;
