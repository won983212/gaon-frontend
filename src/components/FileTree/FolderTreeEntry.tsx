import React, { useCallback, useState } from 'react';
import {
    FolderBlock,
    NameWrapper,
    VerticalLine
} from '@/components/FileTree/style';
import { AiOutlineFolder, AiOutlineFolderOpen } from 'react-icons/all';

interface FolderTreeEntryProps {
    name: string;
    children?: React.ReactNode;
}

export default function FolderTreeEntry({
    name,
    children
}: FolderTreeEntryProps) {
    const [open, setOpen] = useState(false);

    const onClickFolder = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
    }, []);

    return (
        <FolderBlock>
            <NameWrapper onClick={onClickFolder}>
                {open ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
                &nbsp;&nbsp;{name}
            </NameWrapper>
            {open && <VerticalLine>{children}</VerticalLine>}
        </FolderBlock>
    );
}
