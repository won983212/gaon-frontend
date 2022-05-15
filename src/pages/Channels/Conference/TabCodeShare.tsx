import React from 'react';
import { useFilesSWR } from '@/api/conference';
import useChannel from '@/hooks/useChannel';
import {
    BottomMenuBar,
    CodeEditorWrapper,
    FlexLayout,
    InnerEditor,
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
    const { data: channelInfo } = useChannel();

    if (!files) {
        return null;
    }

    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerEditor>
                <CodeEditorWrapper>
                    <CodeEditor />
                </CodeEditorWrapper>
                <SideMenuBar>
                    <TabContainer tabNames={['탐색기', '참가자']}>
                        <FileTree files={files} />
                        <UserList />
                    </TabContainer>
                </SideMenuBar>
            </InnerEditor>
            <BottomMenuBar>
                <TabContainer tabNames={['콘솔']}>
                    <Terminal />
                </TabContainer>
            </BottomMenuBar>
        </FlexLayout>
    );
}
