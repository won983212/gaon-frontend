import React, { useCallback, useState } from 'react';
import Modal from '@/components/Modal';
import useChannel from '@/hooks/useChannel';
import {
    BottomMenuBar,
    CodeEditorTab,
    CodeEditorWrapper,
    InnerEditor,
    SideMenuBar
} from './style';
import TabContainer from '@/components/TabContainer';
import CodeEditor from '@/pages/Channels/Conference/CodeEditor';
import FileTree from '@/components/FileTree';
import { ChannelHeader } from '@/layouts/Workspace/style';
import { useFilesSWR } from '@/api/conference';
import UserList from '@/components/UserList';

function Conference() {
    const { data: files } = useFilesSWR(0);
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);

    const onCloseEnterDialog = useCallback(() => {
        setShowEnterDialog(false);
    }, []);

    if (!files) {
        return null;
    }

    return (
        <CodeEditorTab>
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
                    <p>Tab1</p>
                </TabContainer>
            </BottomMenuBar>
            <Modal
                isOpen={showEnterDialog}
                onAction={onCloseEnterDialog}
                buttons="yesno"
            >
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        </CodeEditorTab>
    );
}

export default Conference;
