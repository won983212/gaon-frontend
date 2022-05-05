import { IChannel } from '@/types';
import React from 'react';
import { MdFormatPaint, MdOutlineWeb, MdQuestionAnswer } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface ChannelItemProps {
    channel: IChannel;
}

function ChannelItem({ channel }: ChannelItemProps) {
    return (
        <NavLink
            key={channel.id}
            to={`/workspace/channel/${channel.id}`}
            className={(navData) =>
                navData.isActive ? 'menuitem selected' : 'menuitem'
            }
        >
            <IconContainer>
                {channel.type === 'chatting' ? (
                    <MdQuestionAnswer />
                ) : channel.type === 'board-sharing' ? (
                    <MdFormatPaint />
                ) : (
                    <MdOutlineWeb />
                )}
            </IconContainer>
            <p>{channel.name}</p>
        </NavLink>
    );
}

const IconContainer = styled.div`
    margin-right: 8px;
`;

export default ChannelItem;
