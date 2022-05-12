import React, { useCallback } from 'react';
import Editor, { Monaco, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
    onChange?: OnChange;
}

export default function CodeEditor({ onChange }: CodeEditorProps) {
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
        []
    );

    return (
        <Editor
            height="100%"
            defaultLanguage="javascript"
            value="console.log('hello, world!')"
            onChange={onChange}
            options={{
                minimap: { enabled: false },
                automaticLayout: false
            }}
            onMount={onMountEditor}
        />
    );
}
