import styled from 'styled-components';

export const ProfileContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    width: 150px;
    align-items: center;
    font-size: 14px;
    line-height: normal;
`;

export const UsernameBlock = styled.div`
    color: var(--text-light);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const JobBlock = styled.div`
    color: var(--primary-light);
    font-weight: lighter;
`;
