import styled from 'styled-components';

export const RightMenu = styled.div`
    float: right;
`;

export const Header = styled.header`
    height: 38px;
    background: var(--primary);
    color: #ffffff;
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
    padding: 5px;
    text-align: center;
`;

export const ChannelHeader = styled.header`
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

export const ContentContainer = styled.div`
    width: 100%;
`;

export const ProfileImg = styled.img`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 5px;
    right: 16px;
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
`;

export const Workspaces = styled.div`
    width: 65px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: var(--primary);
    border-top: 1px solid var(--primary-light);
    border-right: 1px solid var(--primary-light);
    vertical-align: top;
    text-align: center;
    padding: 15px 0 0;
`;

export const Channels = styled.nav`
    width: 260px;
    display: inline-flex;
    flex-direction: column;
    background: var(--primary);
    color: var(--text);
    vertical-align: top;

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
    line-height: 64px;
    border: none;
    width: 100%;
    text-align: left;
    border-top: 1px solid var(--primary-light);
    border-bottom: 1px solid var(--primary-light);
    font-weight: 900;
    font-size: 24px;
    background: var(--primary-dark);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 0;
    padding-left: 16px;
    margin: 0;
    color: white;
    cursor: pointer;
`;

export const MenuScroll = styled.div`
    flex: 1;
    overflow-y: auto;
`;

export const WorkspaceModal = styled.div`
    padding: 10px 0 0;

    & h2 {
        padding-left: 20px;
    }

    & > button {
        width: 100%;
        height: 28px;
        padding: 4px;
        border: none;
        background: transparent;
        border-top: 1px solid rgb(28, 29, 28);
        cursor: pointer;

        &:last-of-type {
            border-bottom: 1px solid rgb(28, 29, 28);
        }
    }
`;

export const Chats = styled.div`
    flex: 1;
`;

export const AddButton = styled.button`
    color: white;
    font-size: 24px;
    display: inline-block;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
`;

export const WorkspaceButton = styled.button`
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    border: 3px solid #3f0e40;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 700;
    color: black;
    cursor: pointer;
`;
