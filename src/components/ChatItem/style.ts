import styled from "styled-components";

// 아바타 이미지, 크기는 글자크기의 2.5배이다.
export const ChatAvatarImg = styled.img`
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    overflow: hidden;
    flex: 0 0 auto;
    border-radius: 100%;
    translate: translate(50, 50);
    left: -3em;
`;

// TODO: 아래 border-color를 테마에 맞추어 수정한다.
// 날짜구분선
export const ChatBorderDiv = styled.div`
    display: flex;
    flex-direcation: row;

    &:before, &:after {
        content: "";
        flex: 1 1;
        border-bottom: 1px soild;
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

// TODO: 아래 border 색상 부분을 테마에 맞추어 수정한다.
// 이미지 썸네일
export const ChatImageThumbnail = styled.img`
    border: 1px solid #ddd;
    width: 300px
`;

// 파일 보더
export const ChatFileBox = styled.div`
    display: flex;
    flex-direction: row;
    border: 2px soild #000;
    border-style: dotted;
    width: fit-content;
`;

// 파일 이미지
export const ChatFileImg = styled.img`
    width: 3em;
`;

// 파일 정보
export const ChatFileInfo = styled.div`
    display: block;
    margin-left: 10px;
    margin-top: 5px;
    margin-right: 1em;
`; 

// 리스트 요소
export const ChatItem = styled.li`
    margin-top: 0.25em;
    position: relative
`;

// 리스트
export const ChatList = styled.ol`
    list-style: none;
    margin: 0;
    padding-left: 3em;
`;

// TODO: color를 테마에 맞추도록 수정한다.
// 채팅 옆에 붙을 날짜
export const ChatDateSpan = styled.span`
    display: none
    color: gray;
    margin-left: 1em;
    font-size: 80%
`;