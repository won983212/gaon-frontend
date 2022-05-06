import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 38px);
    flex-flow: column;
    position: relative;
`;

export const Header = styled.header`
    height: 64px;
    display: flex;
    width: 100%;
    background-color: var(--primary-dark);
    color: white;
    border-left: 1px solid var(--primary-light);
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 1px 0 var(--saf-0);
    padding: 20px 16px 20px 20px;
    font-weight: bold;
    align-items: center;
`;

export const ChatArea = styled.div`
    padding: 2em 2em 1em 2em;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
`;

export const DragOver = styled.div`
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100% - 64px);
    background: white;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
`;
