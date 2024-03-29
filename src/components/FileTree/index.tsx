import React from 'react';
import { v4 } from 'uuid';
import FileTreeEntry from '@/components/FileTree/FileTreeEntry';
import FolderTreeEntry from '@/components/FileTree/FolderTreeEntry';
import { ThemeProvider } from 'styled-components';
import { IconContext } from 'react-icons';
import { FileTreeBlock } from '@/components/FileTree/style';
import { IFileNode } from '@/types';

interface FileTreeProps {
    files: IFileNode[];
}

const Files = function ({ files }: FileTreeProps) {
    return (
        <>
            {files.map((item) => {
                if (!item.id) {
                    item.id = v4();
                }
                if (item.files) {
                    // directory
                    return (
                        <FolderTreeEntry key={item.id} name={item.name}>
                            <Files files={item.files} />
                        </FolderTreeEntry>
                    );
                } else {
                    // file
                    return <FileTreeEntry key={item.id} name={item.name} />;
                }
            })}
        </>
    );
};

export default function FileTree({ files }: FileTreeProps) {
    return (
        <FileTreeBlock>
            <ThemeProvider theme={{ indent: 20 }}>
                <IconContext.Provider value={{ color: 'var(--text-light)' }}>
                    <Files files={files} />
                </IconContext.Provider>
            </ThemeProvider>
        </FileTreeBlock>
    );
}
