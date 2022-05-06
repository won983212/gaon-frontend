import React from 'react';
import ProfileImage from '../ProfileImage';
import { MenuIconWrapper, ProfileContainer, ProjectNameBlock } from './style';
import { MdMenu } from 'react-icons/all';

interface ProjectProfileProps {
    projectName: string;
    avatarUrl: string;
}

export function ProjectProfile({
    projectName,
    avatarUrl
}: ProjectProfileProps) {
    return (
        <ProfileContainer>
            <div>
                <ProfileImage src={avatarUrl} rectangle />
            </div>
            <ProjectNameBlock>{projectName}</ProjectNameBlock>
            <MenuIconWrapper>
                <MdMenu size={16} />
            </MenuIconWrapper>
        </ProfileContainer>
    );
}
