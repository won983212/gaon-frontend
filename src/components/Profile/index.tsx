import {
    JobBlock,
    ProfileContainer,
    UsernameBlock
} from '@/components/Profile/style';
import React from 'react';
import ProfileImage from '../ProfileImage';

interface UserProfileProps {
    username: string;
    job?: string;
    avatarUrl: string;
    avatarSize?: number;
    rectAvatar?: boolean;
}

export default function Profile({
    username,
    job,
    avatarUrl,
    avatarSize = 36,
    rectAvatar = false
}: UserProfileProps) {
    return (
        <ProfileContainer>
            <div>
                <ProfileImage
                    src={avatarUrl}
                    size={avatarSize}
                    rectangle={rectAvatar}
                />
            </div>
            <div>
                <UsernameBlock>{username}</UsernameBlock>
                {job && <JobBlock>{job}</JobBlock>}
            </div>
        </ProfileContainer>
    );
}
