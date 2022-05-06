import { ProfileContainer } from '@/components/UserProfile/style';
import React from 'react';
import ProfileImage from '../ProfileImage';
import styled from 'styled-components';

interface UserProfileProps {
    username: string;
    job: string;
    avatarUrl: string;
}

const UsernameBlock = styled.div`
    color: var(--text-light);
    font-weight: bold;
`;

const JobBlock = styled.div`
    color: var(--primary-light);
    font-weight: lighter;
`;

export function UserProfile({ username, job, avatarUrl }: UserProfileProps) {
    return (
        <ProfileContainer>
            <div>
                <ProfileImage src={avatarUrl} />
            </div>
            <div>
                <UsernameBlock>{username}</UsernameBlock>
                <JobBlock>{job}</JobBlock>
            </div>
        </ProfileContainer>
    );
}
