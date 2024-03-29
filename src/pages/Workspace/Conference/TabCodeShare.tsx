import React, { useCallback, useEffect, useState } from 'react';
import useRoom from '@/hooks/useRoom';
import {
    ContentArea,
    FlexLayout,
    InnerContent,
    SideMenuBar
} from '@/pages/Workspace/Conference/style';
import { ChannelHeader } from '@/layouts/Workspace/style';
import CodeEditor from '@/pages/Workspace/Conference/CodeEditor';
import TabContainer from '@/components/TabContainer';
import UserList from '@/components/UserList';
import * as monaco from 'monaco-editor';
import { ConferenceTabProps } from '@/pages/Workspace/Conference/index';
import { MonacoBinding } from './y-monaco';
import * as yjs from 'yjs';
import SettingTab from '@/pages/Workspace/Conference/SettingTab';
import { useMonaco } from '@monaco-editor/react';
import useSocket from '@/hooks/useSocket';
import { SocketIOProvider } from '@/pages/Workspace/Conference/provider';


export default function TabCodeShare({ users, onShowUserContextMenu }: ConferenceTabProps) {
    const { channelId, workspaceId, channelInfo } = useRoom();
    const [socket] = useSocket(workspaceId);
    const [lang, setLang] = useState('javascript');
    const [allLanguages, setAllLanguages] = useState<string[]>([]);
    const monaco = useMonaco();

    const onMount = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor) => {
            const ydocument = new yjs.Doc();
            const provider = new SocketIOProvider(
                `${workspaceId}/${channelId}`,
                ydocument, {
                    autoConnect: true
                }
            );

            provider.on('status', ({ status }: { status: string }) => {
                console.log(status) // Logs "connected" or "disconnected"
            })

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

    useEffect(() => {
        socket.on('update-lang', setLang);
        socket.emit('select-lang', channelId, setLang);
        setAllLanguages(
            monaco?.languages.getLanguages().map((lang) => lang.id) ?? []
        );
    }, [channelId, monaco?.languages, socket]);

    const onChangeLang = useCallback((lang: string) => {
        setLang(lang);
        socket.emit('update-lang', lang);
    }, [socket]);

    return (
        <FlexLayout>
            <ChannelHeader>{channelInfo?.name}</ChannelHeader>
            <InnerContent>
                <ContentArea>
                    <CodeEditor
                        onMount={onMount}
                        language={lang}
                    />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['참가자', '설정']}>
                        <UserList users={users} onShowUserContextMenu={onShowUserContextMenu}/>
                        <SettingTab
                            allLangs={allLanguages}
                            editorLang={lang}
                            onChangeLang={onChangeLang}
                        />
                    </TabContainer>
                </SideMenuBar>
            </InnerContent>
        </FlexLayout>
    );
}
