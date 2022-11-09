import React, { useCallback, useEffect, useState } from 'react';
import { useFilesSWR } from '@/api/conference';
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
import { WebsocketProvider } from 'y-websocket';
import * as yjs from 'yjs';
import SettingTab from '@/pages/Workspace/Conference/SettingTab';
import { useMonaco } from '@monaco-editor/react';

export default function TabCodeShare({ users }: ConferenceTabProps) {
    const { data: files } = useFilesSWR(0);
    const { channelId, workspaceId, channelInfo } = useRoom();
    const [code, setCode] = useState('');
    const [lang, setLang] = useState('javascript');
    const [allLanguages, setAllLanguages] = useState<string[]>([]);
    const monaco = useMonaco();

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

    useEffect(() => {
        setAllLanguages(
            monaco?.languages.getLanguages().map((lang) => lang.id) ?? []
        );
    }, [monaco?.languages]);

    const onChangeLang = useCallback((lang: string) => {
        setLang(lang);
    }, []);

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
                        language={lang}
                    />
                </ContentArea>
                <SideMenuBar>
                    <TabContainer tabNames={['참가자', '설정']}>
                        <UserList users={users} />
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
