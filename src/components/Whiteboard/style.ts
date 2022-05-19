import styled from 'styled-components';

export const WhiteboardBlock = styled.div`
    display: flex;
    height: 100%;

    & canvas {
        background-color: var(--canvas-background);
    }
`;

export const Seperator = styled.div`
    border-left: 1px solid #dddddd;
    margin: 0 4px;
`;

export const Toolbox = styled.ul`
    position: absolute;
    padding: 4px;
    margin: 12px;
    display: flex;
    list-style: none;
    border-radius: 8px;
    background-color: #efefef;

    & li {
        padding: 4px 4px 0 4px;
        margin-right: 4px;
        border-radius: 8px;
        color: var(--primary-light);

        &.selected {
            background-color: #dddddd;
            color: var(--primary);
        }

        &:hover:not(.selected) {
            background-color: #dddddd;
        }
    }
`;
