import styled from 'styled-components';

export const FileTreeBlock = styled.div`
    margin-top: 12px;
`;

export const NameWrapper = styled.div`
    color: var(--text);
    display: flex;
    align-items: center;
    cursor: pointer;
`;

export const FileBlock = styled.div`
    width: 100%;
    justify-content: space-between;
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    font-weight: normal;
    padding-left: ${(p) => p.theme.indent}px;
    margin-top: 4px;
`;

export const FolderBlock = styled.section`
    font-weight: bold;
    padding-left: ${(p) => p.theme.indent}px;
    margin-top: 4px;
`;

export const VerticalLine = styled.section`
    position: relative;
    :before {
        content: '';
        display: block;
        position: absolute;
        top: -4px;
        left: 1px;
        width: 0;
        height: 100%;
        border: 1px solid var(--primary);
    }
`;
