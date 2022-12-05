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
    onShowUserContextMenu: (e: React.MouseEvent, userId: number) => void;
}

export default function UserList({ users, onShowUserContextMenu }: UserListProps) {
    return (
        <UserListBlock>
            {users.map((user, idx) => (
                <UserItem key={idx} onContextMenu={(e: React.MouseEvent) => {
                    onShowUserContextMenu(e, user.id);
                }}>
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
