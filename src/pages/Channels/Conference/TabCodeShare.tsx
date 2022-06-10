import React, { useCallback, useEffect, useState } from 'react';
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
import * as monaco from 'monaco-editor';
import { CodeChange } from '@/types';
import { ConferenceTabProps } from '@/pages/Channels/Conference/index';
import { MonacoBinding } from './y-monaco';
import { WebsocketProvider } from 'y-websocket';
import * as yjs from 'yjs';

export default function TabCodeShare({ socket, users }: ConferenceTabProps) {
    const { data: files } = useFilesSWR(0);
    const { channelId, channelInfo } = useRoom();
    const [code, setCode] = useState('');

    const onChangeCode = useCallback(
        (
            value: string | undefined,
            ev: monaco.editor.IModelContentChangedEvent
        ) => {
            const changes = ev.changes.map(
                (change): CodeChange => ({
                    rangeLength: change.rangeLength,
                    rangeOffset: change.rangeOffset,
                    text: change.text
                })
            );
            socket.emit('update-code', changes);
        },
        [socket]
    );

    const onMount = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor) => {
            const ydocument = new yjs.Doc();
            const provider = new WebsocketProvider(
                `ws://localhost:6000`,
                'monaco',
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
        []
    );

    const onUpdateCode = useCallback(() => {}, []);

    useEffect(() => {
        socket.on('update-code', onUpdateCode);
        return () => {
            socket.off('update-code', onUpdateCode);
        };
    }, [socket, onUpdateCode]);

    useEffect(() => {
        socket.emit('select-code', channelId, (code: string) => {
            setCode(code);
        });
    }, [channelId, socket]);

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
                        onChange={onChangeCode}
                        onMount={onMount}
                    />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['탐색기', '참가자']}>
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
