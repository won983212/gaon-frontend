import styled from 'styled-components';

export const MenuLocator = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    & > div {
        position: absolute;
        display: inline-block;
        box-shadow: 0 0 0 1px rgba(29, 28, 29, 0.13),
            0 4px 12px 0 rgba(0, 0, 0, 0.12);
        background-color: rgba(248, 248, 248, 1);
        border-radius: 6px;
        user-select: none;
        min-width: 360px;
        z-index: 512;
        color: rgb(29, 28, 29);
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    right: 10px;
    top: 6px;
    background: transparent;
    border: none;
    font-size: 30px;
    cursor: pointer;
`;
