import React from 'react';
import { useFilesSWR } from '@/api/conference';
import useRoom from '@/hooks/useRoom';
import {
    BottomMenuBar,
    ContentArea,
    FlexLayout,
    InnerContent,
    SideMenuBar
} from '@/pages/Channels/Conference/style';
import { ChannelHeader } from '@/layouts/Workspace/style';
import CodeEditor from '@/pages/Channels/Conference/CodeEditor';
import TabContainer from '@/components/TabContainer';
import FileTree from '@/components/FileTree';
import UserList from '@/components/UserList';
import Terminal from '@/components/Terminal';

export default function TabCodeShare() {
    const { data: files } = useFilesSWR(0);
    const { channelInfo } = useRoom();

    if (!files) {
        return null;
    }

    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerContent>
                <ContentArea>
                    <CodeEditor />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['탐색기', '참가자']}>
                        <FileTree files={files} />
                        <UserList />
                    </TabContainer>
                </SideMenuBar>
            </InnerContent>
            <BottomMenuBar>
                <TabContainer tabNames={['콘솔']}>
                    <Terminal />
                </TabContainer>
            </BottomMenuBar>
        </FlexLayout>
    );
}
