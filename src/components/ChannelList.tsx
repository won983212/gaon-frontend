import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { MdExpandMore } from 'react-icons/md';
import ChannelItem from './ChannelItem';
import { ChannelType } from '../utils/types';

interface ChannelListProps {
    channels: ChannelType[];
}

function ChannelList({ channels }: ChannelListProps) {
    const [collapsed, setCollapsed] = useState(false);
    const onToggleCollapse = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    return (
        <>
            <h2>
                <CollapseButton collapse={collapsed} onClick={onToggleCollapse}>
                    <MdExpandMore />
                </CollapseButton>
                <span>List</span>
            </h2>
            <div>
                {!collapsed &&
                    channels.map((channel) => {
                        return (
                            <ChannelItem key={channel.id} channel={channel} />
                        );
                    })}
            </div>
        </>
    );
}

const CollapseButton = styled.button<{ collapse: boolean }>`
    background: transparent;
    border: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-left: 10px;
    cursor: pointer;

    & svg {
        transition: 200ms;
        ${({ collapse }) =>
            collapse
                ? `
                transform: rotateZ(180deg);
            }`
                : `
            & i {
                transform: none;
            }
            `};
    }
`;

export default ChannelList;
