import styled from 'styled-components';

export const CodeEditorTab = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
`;

export const InnerEditor = styled.div`
    display: flex;
    flex: 1;
    overflow-y: auto;
`;

export const CodeEditorWrapper = styled.div`
    background-color: var(--primary);
    flex: 1;
`;

export const SideMenuBar = styled.div`
    width: 260px;
    background-color: var(--primary-dark);
    overflow-y: auto;
`;

export const BottomMenuBar = styled.div`
    height: 200px;
    border-top: 1px solid var(--primary-light);
    background-color: var(--primary-dark);
`;
