import styled from 'styled-components';

export default styled.button`
    margin-bottom: 12px;
    width: 100%;
    max-width: 100%;
    color: #fff;
    background-color: var(--primary);
    border: none;
    font-size: 18px;
    font-weight: 900;
    height: 44px;
    min-width: 96px;
    padding: 0 16px 3px;
    transition: all 80ms linear;
    user-select: none;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

    &:hover {
        background-color: var(--primary-light);
        border: none;
    }
    &:focus {
        --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
        box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
    }
`;
