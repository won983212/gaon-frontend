import styled from 'styled-components';

export const WhiteboardBlock = styled.div`
    display: flex;
    height: 100%;

    & canvas {
        background-color: var(--canvas-background);
    }
`;

export const Toolbox = styled.ul`
    position: absolute;
    padding: 0;
    margin: 12px;
    display: flex;
    list-style: none;

    & li {
        padding: 4px 4px 0 4px;
        margin-right: 4px;
        border-radius: 8px;

        &.selected {
            background-color: #dddddd;
        }

        &:hover:not(.selected) {
            background-color: #efefef;
        }
    }
`;
