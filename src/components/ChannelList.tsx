import ChannelItem from '@/components/ChannelItem';
import CollapseButton from '@/components/CollapseButton';
import { IChannel } from '@/types';
import React, { useCallback, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

interface ChannelListProps {
    channels: IChannel[];
    name: string;
    groupId: number;
    onShowGroupContextMenu: (e: React.MouseEvent, groupId: number) => void;
    onShowChannelContextMenu: (e: React.MouseEvent, channelId: number) => void;
}

function ChannelList({ channels, name, groupId, onShowGroupContextMenu, onShowChannelContextMenu }: ChannelListProps) {
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
                <span onContextMenu={(e: React.MouseEvent)=>onShowGroupContextMenu(e, groupId)}>{name}</span>
            </h2>
            <div>
                {!collapsed &&
                    channels.map((channel) => {
                        return (
                            <ChannelItem key={channel.id} channel={channel} onContextMenu={(e: React.MouseEvent, channelId: number)=>onShowChannelContextMenu(e, channelId)}/>
                        );
                    })}
            </div>
        </>
    );
}

export default ChannelList;
