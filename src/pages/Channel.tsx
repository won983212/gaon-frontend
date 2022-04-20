import React from 'react';
import Workspace from '../layouts/Workspace';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { getChannelNameById } from '../utils/channelManager';

function Channel() {
    const { channelId } = useParams();
    const channelNum = channelId ? +channelId : 0;
    return (
        <Workspace>
            <Header>{getChannelNameById(channelNum)}</Header>
        </Workspace>
    );
}

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 38px);
    flex-flow: column;
    position: relative;
`;

export const Header = styled.header`
    height: 64px;
    display: flex;
    width: 100%;
    background-color: var(--primary-dark);
    color: white;
    border-left: 1px solid var(--primary-light);
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 1px 0 var(--saf-0);
    padding: 20px 16px 20px 20px;
    font-weight: bold;
    align-items: center;
`;

export const DragOver = styled.div`
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100% - 64px);
    background: white;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
`;

export default Channel;
