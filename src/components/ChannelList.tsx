import ChannelItem from '@/components/ChannelItem';
import CollapseButton from '@/components/CollapseButton';
import { IChannel } from '@/types';
import React, { useCallback, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

interface ChannelListProps {
    channels: IChannel[];
    name: string;
    groupId: number;
    onShowGroupContextMenu: (e: React.MouseEvent) => void;
    onShowChannelContextMenu: (e: React.MouseEvent, channelId: number) => void;
    onNeedChannelList: (groupId: number) => void;
}

function ChannelList({
    channels,
    name,
    groupId,
    onShowGroupContextMenu,
    onShowChannelContextMenu,
    onNeedChannelList
}: ChannelListProps) {
    const [collapsed, setCollapsed] = useState(true);
    const onToggleCollapse = useCallback(() => {
        setCollapsed((prev) => !prev);
        if (collapsed) {
            onNeedChannelList(groupId);
        }
    }, [collapsed, groupId, onNeedChannelList]);

    return (
        <>
            <h2>
                <CollapseButton collapse={collapsed} onClick={onToggleCollapse}>
                    <MdExpandMore />
                </CollapseButton>
                <span onContextMenu={onShowGroupContextMenu}>{name}</span>
            </h2>
            <div>
                {!collapsed &&
                    (channels.length === 0 ? (
                        <div className="menuitem">비어있음</div>
                    ) : (
                        channels.map((channel) => {
                            return (
                                <ChannelItem
                                    key={channel.id}
                                    channel={channel}
                                    onContextMenu={(e: React.MouseEvent) =>
                                        onShowChannelContextMenu(e, channel.id)
                                    }
                                />
                            );
                        })
                    ))}
            </div>
        </>
    );
}

export default ChannelList;
