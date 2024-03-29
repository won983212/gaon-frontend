import styled, { css } from 'styled-components';
import { cssVar, lighten } from 'polished';

type Size = 'large' | 'medium' | 'small';
type Variant = 'normal' | 'text';

interface ButtonProps {
    size?: Size;
    variant?: Variant;
    fullWidth?: boolean;
    noPadding?: boolean;
    color?: string;
}

const Button = styled.button<ButtonProps>`
    ${(props) =>
        props.fullWidth &&
        css`
            width: 100%;
        `}

    ${(props) =>
        props.size === 'large'
            ? css`
                  height: 3rem;
                  font-size: 1.25rem;
              `
            : props.size === 'medium'
            ? css`
                  height: 2.25rem;
                  font-size: 1rem;
              `
            : css`
                  height: 1.75rem;
                  font-size: 0.8rem;
              `}

  ${(props) =>
        props.variant === 'text'
            ? css`
                  color: ${props.color ? props.color : 'dodgerblue'};
                  background-color: unset;
              `
            : css`
                  color: #fff;
                  background-color: ${props.color
                      ? props.color
                      : 'var(--primary)'};
                  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
              `}

  max-width: 100%;
    border: none;
    transition: all 80ms linear;
    user-select: none;
    outline: none;
    cursor: pointer;
    border-radius: 4px;

    ${(props) =>
        !props.noPadding &&
        css`
            padding: 0 1rem;
        `}
    &:hover {
        background-color: ${(props) =>
            lighten(
                0.2,
                props.color ? props.color : cssVar('--primary').toString()
            )};
        border: none;
    }

    &:focus {
        --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
        box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
    }
`;

Button.defaultProps = {
    size: 'medium',
    variant: 'normal'
};

export default Button;
