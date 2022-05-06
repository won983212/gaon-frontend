import styled from 'styled-components';

export const NoChannelMessageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: var(--text);
`;

export const IconContainer = styled.div`
    margin: 8px;
    display: flex;
    & svg {
        width: 30px;
        height: 30px;
    }
`;
