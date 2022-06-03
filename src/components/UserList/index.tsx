import React from 'react';
import gravatar from 'gravatar';
import { MdMic, MdMicOff } from 'react-icons/all';
import ProfileImage from '@/components/ProfileImage';
import {
    UserItem,
    UserListBlock,
    UsernameBlock
} from '@/components/UserList/style';
import { IConnectedUser } from '@/types';

export interface UserListProps {
    users: IConnectedUser[];
}

export default function UserList({ users }: UserListProps) {
    return (
        <UserListBlock>
            {users.map((user, idx) => (
                <UserItem key={idx}>
                    <ProfileImage
                        src={gravatar.url(user.username, {
                            s: '24px',
                            d: 'retro'
                        })}
                        size={24}
                    />
                    <UsernameBlock>{user.username}</UsernameBlock>
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
