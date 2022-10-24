import styled from 'styled-components';

export const DropdownContent = styled.div`
    position: absolute;
    background-color: var(--primary);
    min-width: 200px;
    width: inherit;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
    z-index: 1;
    margin-top: 64px;
`;

export const DropdownList = styled.ul`
    list-style: none;
`;

export const DropdownItem = styled.li`
    font-size: 15px;
    margin-bottom: 5px;
    align-content: center;
    &:hover {
        background-color: var(--primary-light);
    }
`;
