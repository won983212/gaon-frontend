import styled from 'styled-components';

export const UserListBlock = styled.ul`
    list-style: none;
    padding: 0 20px 0 20px;
`;

export const UserItem = styled.div`
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: var(--text);
`;

export const UsernameBlock = styled.div`
    color: var(--text);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
`;
