import styled from 'styled-components';

export const TerminalBlock = styled.div`
    margin: 8px;
    flex: 1;
`;

export const InputBlock = styled.form`
    display: flex;
    color: var(--text);
`;

export const InputSign = styled.div`
    margin-right: 8px;
    user-select: none;
`;

export const InputArea = styled.input`
    color: var(--text);
    border: none;
    background-color: transparent;
    outline: none;
    font-size: inherit;
    padding: 0;
    width: 100%;
`;

export const OutBlock = styled.div`
    color: var(--text);
`;

export const WarnBlock = styled.div`
    color: goldenrod;
`;

export const ErrorBlock = styled.div`
    color: tomato;
`;
