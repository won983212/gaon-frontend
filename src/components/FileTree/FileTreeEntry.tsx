import React, { useCallback } from 'react';
import { FileBlock, NameWrapper } from '@/components/FileTree/style';
import { AiOutlineFile } from 'react-icons/all';

interface FileTreeEntryProps {
    name: string;
}

export default function FileTreeEntry({ name }: FileTreeEntryProps) {
    const onClickFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <FileBlock onClick={onClickFile}>
            <NameWrapper>
                <AiOutlineFile />
                &nbsp;&nbsp;{name}
            </NameWrapper>
        </FileBlock>
    );
}
