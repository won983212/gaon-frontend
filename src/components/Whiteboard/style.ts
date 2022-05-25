import styled, { css } from 'styled-components';
import React from 'react';

export const CommonMenuStyle: React.CSSProperties = {
    background: '#efefef',
    boxShadow: 'none',
    minWidth: '0'
};

export const WhiteboardBlock = styled.div`
    display: flex;
    height: 100%;

    & canvas {
        background-color: var(--canvas-background);
    }
`;

export const Seperator = styled.div`
    border-top: 1px solid #dddddd;
    margin: 4px 0;
`;

export const Toolbox = styled.ul`
    position: absolute;
    padding: 4px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    list-style: none;
    border-radius: 8px;
    background-color: #efefef;

    & li {
        padding: 4px 4px 0 4px;
        margin-bottom: 4px;
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

export const ColorButton = styled.div<{ color: string; selected?: boolean }>`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 12px;
    border: ${(props) => (props.selected ? '2px' : '1px')} solid
        rgba(100, 100, 100, 0.7);
    transition: 80ms;

    ${(props) =>
        props.color === 'transparent'
            ? css`
                  background-image: url('/transparent.png');
              `
            : css`
                  background-color: ${props.color};
              `}

    ${(props) =>
        props.selected &&
        css`
            box-shadow: 0 0 3px black;
        `}

    &:hover {
        border-width: 3px;
    }
`;

export const ThicknessButton = styled.div<{
    thickness: number;
    selected?: boolean;
}>`
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #efefef;
    border-radius: 50%;
    margin-right: 12px;
    border: ${(props) => (props.selected ? '2px' : '0px')} solid
        rgba(100, 100, 100, 0.7);
    transition: 80ms;

    ${(props) =>
        props.selected &&
        css`
            box-shadow: 0 0 3px black;
        `}

    &:hover {
        border-width: 3px;
    }

    & > div {
        width: 12px;
        height: ${(props) => props.thickness}px;
        background-color: black;
    }
`;

export const PaletteMenuFlexBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
`;

export const MenuLabel = styled.span`
    margin-bottom: 4px;
    font-size: 9pt;
    color: #707070;
`;

export const SelectContainer = styled.span`
    display: flex;
    margin-bottom: 12px;
`;
