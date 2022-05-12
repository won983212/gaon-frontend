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

function Conference() {
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);

    const onCloseEnterDialog = useCallback((action: Action) => {
        setShowEnterDialog(false);
    }, []);

    return (
        <CodeEditorTab>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerEditor>
                <CodeEditorWrapper>
                    <CodeEditor />
                </CodeEditorWrapper>
                <SideMenuBar>
                    <TabContainer tabNames={['탐색기', '참가자']}>
                        <FileTree
                            files={[
                                {
                                    name: 'client',
                                    files: [
                                        {
                                            name: 'ui',
                                            files: [
                                                { name: 'Toggle.js' },
                                                { name: 'Button.js' },
                                                { name: 'Button.style.js' }
                                            ]
                                        },
                                        {
                                            name: 'ux',
                                            files: [
                                                { name: 'Toggle.js' },
                                                { name: 'Button.js' },
                                                { name: 'Button.style.js' }
                                            ]
                                        },
                                        {
                                            name: 'Menu',
                                            files: [
                                                { name: 'Tree.js' },
                                                { name: 'Tree.style.js' }
                                            ]
                                        },
                                        {
                                            name: 'Menu',
                                            files: [
                                                { name: 'Tree.js' },
                                                { name: 'Tree.style.js' }
                                            ]
                                        },
                                        {
                                            name: 'Menu',
                                            files: [
                                                { name: 'Tree.js' },
                                                { name: 'Tree.style.js' }
                                            ]
                                        },
                                        {
                                            name: 'configs',
                                            files: [
                                                { name: 'Tree.js' },
                                                { name: 'Tree.style.js' }
                                            ]
                                        },
                                        { name: 'setup.js' },
                                        { name: 'setupTests.js' }
                                    ]
                                },
                                {
                                    name: 'packages',
                                    files: [{ name: 'main.js' }]
                                },
                                { name: 'index.js' }
                            ]}
                        />
                        <p>Tab2</p>
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
