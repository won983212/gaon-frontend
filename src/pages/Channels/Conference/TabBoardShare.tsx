import React from 'react';
import { ChannelHeader } from '@/layouts/Workspace/style';
import {
    ContentArea,
    FlexLayout,
    InnerContent,
    SideMenuBar
} from '@/pages/Channels/Conference/style';
import useChannel from '@/hooks/useChannel';
import TabContainer from '@/components/TabContainer';
import UserList from '@/components/UserList';
import Whiteboard from '@/components/Whiteboard';

export default function TabCodeShare() {
    const { data: channelInfo } = useChannel();
    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerContent>
                <ContentArea>
                    <Whiteboard />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['참가자']}>
                        <UserList />
                    </TabContainer>
                </SideMenuBar>
            </InnerContent>
        </FlexLayout>
    );
}
