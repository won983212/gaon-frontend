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
    nameColor?: string;
    jobColor?: string;
    avatarSize?: number;
    rectAvatar?: boolean;
}

export default function Profile({
    username,
    job,
    avatarUrl,
    nameColor = 'var(--text-light)',
    jobColor = 'var(--primary-light)',
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
                <UsernameBlock color={nameColor}>{username}</UsernameBlock>
                {job && <JobBlock color={jobColor}>{job}</JobBlock>}
            </div>
        </ProfileContainer>
    );
}
