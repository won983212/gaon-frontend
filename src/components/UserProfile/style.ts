import styled from 'styled-components';

export const ProfileImage = styled.img`
    border-radius: 100%;
    object-fit: cover;
    margin: auto;
    transform: translate(50, 50);
    width: 50px;
    height: 50px;
    margin-right: 10px;
`;

export const ProfileContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    width: 150px;
    height: 64px;
    align-items: middle;
    justify-content: space-around;
    font-size: 14px;
    line-height: normal;
    font-weight: lighter;
    margin-top: 3%;
`;
