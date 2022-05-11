import React, { useCallback, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import useChannel from '@/hooks/useChannel';
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';

function Conference() {
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);

    const onCloseEnterDialog = useCallback((action: Action) => {
        setShowEnterDialog(false);
    }, []);

    const onChangeCode = (
        value: string | undefined,
        ev: monaco.editor.IModelContentChangedEvent
    ) => {
        console.log(value, ev);
    };

    return (
        <div>
            <Editor
                height="30vh"
                defaultLanguage="javascript"
                value="console.log('hello, world!')"
                onChange={onChangeCode}
            />
            <Modal
                isOpen={showEnterDialog}
                onAction={onCloseEnterDialog}
                buttons="yesno"
            >
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        </div>
    );
}

export default Conference;
