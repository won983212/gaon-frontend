import styled, { css } from 'styled-components';

export const TabContainerBlock = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
`;

export const ContentArea = styled.div`
    flex: 1;
    overflow-y: auto;
`;

export const TabHeaders = styled.ul`
    list-style: none;
    margin: 4px 8px;
    padding: 0;
`;

export const TabHeaderItem = styled.li<{ isSelected: boolean }>`
    background: none;
    color: var(--text);
    display: inline-block;
    padding: 6px 10px;
    font-size: 9pt;
    cursor: pointer;

    ${(props) =>
        props.isSelected &&
        css`
            font-weight: bold;
            border-bottom: 2px solid var(--primary-light);
        `}
`;
