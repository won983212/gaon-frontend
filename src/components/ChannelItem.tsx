import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdQuestionAnswer } from 'react-icons/md';
import styled from 'styled-components';
import { ChannelType } from '@/utils/types';

interface ChannelItemProps {
    channel: ChannelType;
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
            <Icon>
                <MdQuestionAnswer />
            </Icon>
            <h2>{channel.name}</h2>
        </NavLink>
    );
}

const Icon = styled.div`
    margin-right: 8px;
`;

export default ChannelItem;
