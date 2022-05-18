import React from 'react';
import gravatar from 'gravatar';
import { MdMic, MdMicOff } from 'react-icons/all';
import ProfileImage from '@/components/ProfileImage';
import {
    UserItem,
    UserListBlock,
    UsernameBlock
} from '@/components/UserList/style';

// TODO 드래그 방지 추가
const dummyUserList = [
    { name: '이현', mute: false },
    { name: '이용욱', mute: true },
    { name: '조정민', mute: false },
    { name: 'abc', mute: true },
    { name: 'abkxdrbhgbhkxdgrbkxdgrbhjkxdgrbhjkc', mute: true },
    { name: '가나다라마바사', mute: false },
    { name: '1234_abc_쉙', mute: false }
];

export default function UserList() {
    return (
        <UserListBlock>
            {dummyUserList.map((user, idx) => (
                <UserItem key={idx}>
                    <ProfileImage
                        src={gravatar.url(user.name, {
                            s: '24px',
                            d: 'retro'
                        })}
                        size={24}
                    />
                    <UsernameBlock>{user.name}</UsernameBlock>
                    {user.mute ? (
                        <MdMicOff color="var(--primary-light)" size={20} />
                    ) : (
                        <MdMic color="var(--primary-light)" size={20} />
                    )}
                </UserItem>
            ))}
        </UserListBlock>
    );
}
