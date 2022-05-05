import styled from 'styled-components';

export const ChatArea = styled.div`
    width: 100%;
    background: #fff;
    padding: 10px;
    position: relative;
    border-radius: 8px;
    border: 1px solid #ccc;
    display: flex;

    & textarea {
        width: 100%;
        background: none;
        border: none;
        outline: none !important;
        resize: none !important;
        font-size: 18px;
        height: 32px;
        padding-right: 20px;
        color: #444;
    }
    & button {
        color: #4a90e2;
        border: none;
        align-self: flex-start;
        background: #fff;
        font-size: 12px;
        width: 50px;
        height: 32px;
        text-transform: uppercase;
        line-height: 1;
        outline: none !important;
        cursor: pointer;
        &:hover {
            color: #333;
        }
    }
`;
