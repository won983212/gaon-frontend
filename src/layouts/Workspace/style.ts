import styled from 'styled-components';

export const ChannelHeader = styled.header`
    height: 64px;
    display: flex;
    width: 100%;
    background-color: var(--primary);
    color: white;
    box-shadow: 4px 0 2px 2px #222222;
    padding: 20px 16px 20px 20px;
    font-weight: bold;
    align-items: center;
    z-index: 1;
`;

export const ContentContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const ProfileMenu = styled.div`
    display: flex;
    padding: 20px;

    & img {
        display: flex;
    }

    & > div {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    & #profile-name {
        font-weight: bold;
        display: inline-flex;
    }

    & #profile-active {
        font-size: 13px;
        display: inline-flex;
    }
`;

export const LogOutButton = styled.button`
    border: none;
    width: 100%;
    border-top: 1px solid rgb(29, 28, 29);
    background: transparent;
    display: block;
    height: 33px;
    padding: 5px 20px 5px;
    outline: none;
    cursor: pointer;
`;

export const WorkspaceWrapper = styled.div`
    display: flex;
    flex: 1;
    height: 100vh;
`;

export const Channels = styled.nav`
    width: 260px;
    display: inline-flex;
    flex-direction: column;
    background: var(--primary-dark);
    color: var(--text);
    vertical-align: top;
    box-shadow: -4px 0 6px 4px #222222;
    z-index: 1;

    & .menuitem {
        padding-left: 36px;
        color: inherit;
        text-decoration: none;
        height: 28px;
        line-height: 28px;
        display: flex;
        align-items: center;

        &.selected {
            color: white;
        }
    }

    & .bold {
        color: white;
        font-weight: bold;
    }

    & .count {
        margin-left: auto;
        background: #cd2553;
        border-radius: 16px;
        display: inline-block;
        font-size: 12px;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
        padding: 0 9px;
        color: white;
        margin-right: 16px;
    }

    & h2 {
        height: 36px;
        line-height: 36px;
        margin: 12px 0 0 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 15px;
    }
`;

export const WorkspaceName = styled.button`
    height: 64px;
    display: flex;
    align-items: center;
    line-height: 64px;
    border: none;
    width: 100%;
    text-align: left;
    font-weight: 900;
    font-size: 24px;
    background: var(--primary-dark);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 16px;
    margin: 0;
    color: white;
    cursor: pointer;
`;

export const WorkspaceProfileWrapper = styled.div`
    flex: 1;
`;

export const MenuIconWrapper = styled.div`
    color: var(--primary-light);
    margin-right: 12px;
`;

export const ConferenceMenu = styled.div`
    display: flex;
    align-items: center;
    padding: 0 8px 0 8px;
    background: var(--primary-darker);
    height: 48px;
    border-bottom: 1px solid var(--primary);
`;

export const ProfileName = styled(WorkspaceName)`
    background: var(--primary-darker);
`;

export const MenuScroll = styled.div`
    flex: 1;
    overflow-y: auto;
`;
