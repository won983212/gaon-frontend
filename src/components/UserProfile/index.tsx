import { ProfileContainer, ProfileImage } from '@/components/UserProfile/style';
import { IUser, IUserProfile } from '@/types';
import React from 'react';
import gravatar from 'gravatar';

export function UserProfile({nickname, status, jobTitle, imgSrc}: IUserProfile) {
    return  <ProfileContainer>
                <div>
                    <ProfileImage src={imgSrc}/> 
                </div>
                <div>
                    <div style={{fontWeight: 'bolder'}}>{nickname}</div>
                    <div>{jobTitle}</div>
                </div>
            </ProfileContainer>
}