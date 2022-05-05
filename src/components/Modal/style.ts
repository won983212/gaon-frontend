import styled from 'styled-components';

export const ModalWrapper = styled.div`
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);

    &.open {
        display: flex;
        align-items: center;
    }
`;

export const ModalPanel = styled.div`
    width: 90%;
    max-width: 450px;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: #fff;
    overflow: hidden;
`;

export const Content = styled.div`
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    border-top: 1px solid #dee2e6;
`;

export const Actions = styled.div`
    padding: 12px 16px;
    text-align: right;
`;
