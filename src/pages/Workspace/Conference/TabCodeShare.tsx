import React, { useCallback, useEffect, useState } from 'react';
import { useFilesSWR } from '@/api/conference';
import useRoom from '@/hooks/useRoom';
import {
    BottomMenuBar,
    ContentArea,
    FlexLayout,
    InnerContent,
    SideMenuBar
} from '@/pages/Workspace/Conference/style';
import { ChannelHeader } from '@/layouts/Workspace/style';
import CodeEditor from '@/pages/Workspace/Conference/CodeEditor';
import TabContainer from '@/components/TabContainer';
import FileTree from '@/components/FileTree';
import UserList from '@/components/UserList';
import Terminal from '@/components/Terminal';
import * as monaco from 'monaco-editor';
import { ConferenceTabProps } from '@/pages/Workspace/Conference/index';
import { MonacoBinding } from './y-monaco';
import { WebsocketProvider } from 'y-websocket';
import * as yjs from 'yjs';

export default function TabCodeShare({ socket, users }: ConferenceTabProps) {
    const { data: files } = useFilesSWR(0);
    const { channelId, workspaceId, channelInfo } = useRoom();
    const [code, setCode] = useState('');

    const onMount = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor) => {
            const ydocument = new yjs.Doc();
            const provider = new WebsocketProvider(
                `ws://localhost:6000`,
                `${workspaceId}/${channelId}`,
                ydocument
            );
            const type = ydocument.getText('monaco');
            const model = editor.getModel();
            if (model) {
                new MonacoBinding(
                    type,
                    model,
                    new Set([editor]),
                    provider.awareness
                );
            }
        },
        [channelId, workspaceId]
    );

    if (!files) {
        return null;
    }

    return (
        <FlexLayout>
            <ChannelHeader onClick={() => setCode('Empty')}>
                {channelInfo?.name}
            </ChannelHeader>
            <InnerContent>
                <ContentArea>
                    <CodeEditor
                        value={code}
                        onMount={onMount}
                    />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['설정', '참가자']}>
                        <FileTree files={files} />
                        <UserList users={users} />
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
