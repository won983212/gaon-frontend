import React from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import {
    ContentArea,
    FlexLayout,
    InnerContent,
    SideMenuBar
} from '@/pages/Workspace/Conference/style';
import useRoom from '@/hooks/useRoom';
import TabContainer from '@/components/TabContainer';
import UserList from '@/components/UserList';
import Whiteboard from '@/components/Whiteboard';
import { ConferenceTabProps } from '@/pages/Workspace/Conference/index';

export default function TabBoardShare({ users, onShowUserContextMenu }: ConferenceTabProps) {
    const { channelInfo } = useRoom();

    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerContent>
                <ContentArea>
                    <Whiteboard />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['참가자']}>
                        <UserList users={users} onShowUserContextMenu={onShowUserContextMenu}/>
                    </TabContainer>
                </SideMenuBar>
            </InnerContent>
        </FlexLayout>
    );
}
