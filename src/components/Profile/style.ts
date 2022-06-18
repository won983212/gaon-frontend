import styled from 'styled-components';

export const ProfileContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 14px;
    line-height: normal;
`;

export const UsernameBlock = styled.div`
    color: ${(props) => props.color};
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const JobBlock = styled.div`
    color: ${(props) => props.color};
    font-weight: lighter;
`;
