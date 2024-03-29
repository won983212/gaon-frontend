import styled from 'styled-components';

export default styled.button<{ collapse: boolean }>`
    background: transparent;
    border: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-left: 10px;
    transition: 200ms;
    transform: none;

    ${({ collapse }) =>
        collapse &&
        `
        transform: rotateZ(180deg);
        }
    `};
`;
