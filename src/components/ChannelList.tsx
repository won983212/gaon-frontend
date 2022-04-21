import ChannelItem from '@/components/ChannelItem';
import CollapseButton from '@/components/CollapseButton';
import { IChannel } from '@/types';
import React, { useCallback, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

interface ChannelListProps {
    channels: IChannel[];
    name: string;
}

function ChannelList({ channels, name }: ChannelListProps) {
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
                <span>{name}</span>
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

export default ChannelList;
