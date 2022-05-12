import React, { useCallback, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
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
import { useNavigate } from 'react-router';
import Terminal from '@/components/Terminal';

function Conference() {
    const navigate = useNavigate();
    const { data: files } = useFilesSWR(0);
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);

    const onCloseEnterDialog = useCallback(
        (action: Action) => {
            if (action === 'yes') {
                setShowEnterDialog(false);
            } else {
                navigate('/workspace/channel');
            }
        },
        [navigate]
    );

    if (!files) {
        return null;
    }

    if (showEnterDialog) {
        return (
            <Modal isOpen={true} onAction={onCloseEnterDialog} buttons="yesno">
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        );
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
                    <Terminal />
                </TabContainer>
            </BottomMenuBar>
        </CodeEditorTab>
    );
}

export default Conference;
