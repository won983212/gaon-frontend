import styled from 'styled-components';

// 아바타 이미지, 크기는 글자크기의 2.5배이다.
export const ChatAvatarImg = styled.img`
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    overflow: hidden;
    flex: 0 0 auto;
    border-radius: 100%;
    left: -3em;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

// 날짜구분선
export const ChatBorderDiv = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:before,
    &:after {
        content: '';
        flex: 1 1;
        border-bottom: 1px solid;
        margin: auto;
        border-color: black;
    }

    &:before {
        margin-right: 10px;
    }

    &:after {
        margin-left: 10px;
    }
`;

// 이미지 썸네일
export const ChatImageThumbnail = styled.img`
    border: 1px solid #ddd;
    width: 300px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

// 파일 보더
export const ChatFileBox = styled.div`
    display: flex;
    background: var(--primary);
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    width: fit-content;
    padding: 8px 12px;
    user-select: none;
`;

export const ChatFileText = styled.a`
    color: var(--text-light);
    text-decoration: none;
    font-weight: bold;
    margin-left: 8px;
`;

// 리스트 요소
export const ChatItem = styled.li`
    margin-top: 0.25em;
    position: relative;
`;

// 리스트
export const ChatList = styled.ol`
    list-style: none;
    margin: 0;
    flex: 1;
    padding-left: 3em;
`;

// 채팅 옆에 붙을 날짜
export const ChatDateSpan = styled.span`
    display: none;
    color: gray;
    margin-left: 1em;
    font-size: 80%;
`;

export const NewChatBorder = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:before,
    &:after {
        content: '';
        flex: 1 1;
        border-bottom: 1px solid;
        margin: auto;
        border-color: black;
    }

    &:before {
        margin-right: 10px;
    }

    &:after {
        margin-left: 10px;
    }

    border-color: red;
`;
