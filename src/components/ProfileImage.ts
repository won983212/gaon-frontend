import styled, { css } from 'styled-components';

interface ProfileImageProps {
    rectangle?: boolean;
    size?: number;
}

const ProfileImage = styled.img<ProfileImageProps>`
    ${(props) =>
        props.rectangle
            ? css`
                  border-radius: 10%;
              `
            : css`
                  border-radius: 100%;
              `}
    object-fit: cover;
    margin: auto;
    transform: translate(50, 50);
    ${(props) =>
        css`
            width: ${props.size}px;
            height: ${props.size}px;
        `}
    margin-right: 10px;
`;

ProfileImage.defaultProps = {
    size: 36
};

export default ProfileImage;
