import styled from 'styled-components';

export const BackgroundContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const BackgroundPanel = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    margin-top: 172px;
    width: 400px;
    height: 300px;
    padding: 16px;
    box-shadow: 0 0 16px 4px lightgrey;
`;

export const ContentPanel = styled.div`
    flex: 1;
`;

export const ActionPanel = styled.div`
    display: flex;
    justify-content: space-around;
`;

export const Title = styled.h2`
    text-align: center;
`;

export const Content = styled.p`
    color: var(--text);
`;

export const ProjectNameMark = styled.span`
    background-color: lightgoldenrodyellow;
    font-weight: bold;
`;