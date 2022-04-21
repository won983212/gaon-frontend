import styled from 'styled-components';

export const MenuItemBlock = styled.div`
    & a {
        padding-left: 10px;
        color: inherit;
        text-decoration: none;
        height: 28px;
        line-height: 28px;
        display: flex;
        align-items: center;
    }

    &.selected {
        color: white;
    }
`;

export const MenuIconContainer = styled.div`
    border: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
`;
