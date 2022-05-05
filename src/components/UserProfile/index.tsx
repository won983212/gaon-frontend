import { ProfileContainer, ProfileImage } from '@/components/UserProfile/style';
import React from 'react';

interface UserProfileProps {
    username: string;
    job: string;
    avatarUrl: string;
}

export function UserProfile({ username, job, avatarUrl }: UserProfileProps) {
    return (
        <ProfileContainer>
            <div>
                <ProfileImage src={avatarUrl} />
            </div>
            <div>
                <div style={{ fontWeight: 'bolder' }}>{username}</div>
                <div>{job}</div>
            </div>
        </ProfileContainer>
    );
}
