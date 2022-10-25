import React, { useCallback } from 'react';
import Editor, { Monaco, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
    value: string;
    language: string;
    onChange?: OnChange;
    onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

export default function CodeEditor({
    value,
    onChange,
    onMount,
    language
}: CodeEditorProps) {
    const onMountEditor = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
            monaco.editor.defineTheme('app-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#434343'
                }
            });
            monaco.editor.setTheme('app-theme');

            // initial layout
            if (onMount) {
                onMount(editor);
            }
            editor.layout();

            // monaco editor autosize
            window.addEventListener('resize', () => {
                editor.layout({ width: 0, height: 0 });
                window.requestAnimationFrame(() => {
                    const parent = editor.getDomNode()?.parentElement;
                    if (parent) {
                        const rect = parent.getBoundingClientRect();
                        editor.layout({
                            width: rect.width,
                            height: rect.height
                        });
                    }
                });
            });
        },
        [onMount]
    );

    return (
        <Editor
            height="100%"
            defaultLanguage="javascript"
            language={language}
            value={value}
            onChange={onChange}
            options={{
                minimap: { enabled: false },
                automaticLayout: false
            }}
            onMount={onMountEditor}
        />
    );
}
