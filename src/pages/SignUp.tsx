import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useInput from '@/hooks/useInput';
import { doSignUp } from '@/api/auth';

function SignUp() {
    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [mismatchError, setMismatchError] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [signUpError, setSignUpError] = useState('');

    const onSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            doSignUp(email, nickname, password)
                .then((response) => {
                    setSignUpSuccess(response.data === 'ok');
                })
                .catch((error) => {
                    setSignUpError(error.response.data);
                });
        },
        [email, nickname, password]
    );

    const onChangePassword = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            setMismatchError(e.target.value !== passwordCheck);
        },
        [passwordCheck]
    );

    const onChangePasswordCheck = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordCheck(e.target.value);
            setMismatchError(password !== e.target.value);
        },
        [password]
    );

    return (
        <SignUpContainer id="container">
            <SignUpForm>
                <Header>Gaon</Header>
                <Form onSubmit={onSubmit}>
                    <Label id="email-label">
                        <span>이메일 주소</span>
                        <div>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={onChangeEmail}
                            />
                        </div>
                    </Label>
                    <Label id="nickname-label">
                        <span>닉네임</span>
                        <div>
                            <Input
                                type="text"
                                id="nickname"
                                name="nickname"
                                value={nickname}
                                onChange={onChangeNickname}
                            />
                        </div>
                    </Label>
                    <Label id="password-label">
                        <span>비밀번호</span>
                        <div>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={onChangePassword}
                            />
                        </div>
                    </Label>
                    <Label id="password-check-label">
                        <span>비밀번호 확인</span>
                        <div>
                            <Input
                                type="password"
                                id="password-check"
                                name="password-check"
                                value={passwordCheck}
                                onChange={onChangePasswordCheck}
                            />
                        </div>
                        {mismatchError && (
                            <Error>비밀번호가 일치하지 않습니다.</Error>
                        )}
                        {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                        {signUpError && <Error>{signUpError}</Error>}
                        {signUpSuccess && (
                            <Success>
                                회원가입되었습니다! 로그인해주세요.
                            </Success>
                        )}
                    </Label>

                    <LinkContainer>
                        이미 회원이라면?&nbsp;
                        <Link to="/login">로그인</Link>
                    </LinkContainer>
                    <Button type="submit">회원가입</Button>
                </Form>
            </SignUpForm>
        </SignUpContainer>
    );
}

const SignUpContainer = styled.div`
    text-align: center;
    margin-top: 50px;
`;

const SignUpForm = styled.div`
    background-color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 40px;
`;

const Header = styled.header`
    text-align: center;
    font-family: Slack-Larsseit, Helvetica Neue, Helvetica, Segoe UI, Tahoma,
        Arial, sans-serif;
    font-weight: 700;
    font-size: 48px;
    line-height: 46px;
    letter-spacing: -0.75px;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const Form = styled.form`
    margin: 0 auto;
    width: 400px;
    max-width: 400px;
`;

const Label = styled.label`
    margin-bottom: 16px;

    & > span {
        display: block;
        text-align: left;
        padding-bottom: 8px;
        font-size: 15px;
        cursor: pointer;
        line-height: 1.46666667;
        font-weight: 700;
    }
`;

const Input = styled.input`
    border-radius: 4px;
    --saf-0: rgba(var(--sk_foreground_high_solid, 134, 134, 134), 1);
    border: 1px solid var(--saf-0);
    transition: border 80ms ease-out, box-shadow 80ms ease-out;
    box-sizing: border-box;
    margin: 0 0 20px;
    width: 100%;
    color: rgba(var(--sk_primary_foreground, 29, 28, 29), 1);
    background-color: rgba(var(--sk_primary_background, 255, 255, 255), 1);
    padding: 12px;
    height: 44px;
    padding-top: 11px;
    padding-bottom: 13px;
    font-size: 18px;
    line-height: 1.33333333;

    &:focus {
        --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
        box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
    }
`;

const Button = styled.button`
    margin-bottom: 12px;
    width: 100%;
    max-width: 100%;
    color: #fff;
    background-color: var(--primary);
    border: none;
    font-size: 18px;
    font-weight: 900;
    height: 44px;
    min-width: 96px;
    padding: 0 16px 3px;
    transition: all 80ms linear;
    user-select: none;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

    &:hover {
        background-color: var(--primary-light);
        border: none;
    }
    &:focus {
        --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
        box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
    }
`;

const Error = styled.div`
    color: #e01e5a;
    margin: 8px 0 16px;
    font-weight: bold;
`;

const Success = styled.div`
    color: #2eb67d;
    font-weight: bold;
`;

const LinkContainer = styled.p`
    font-size: 13px;
    color: #616061;
    margin: 0 auto 8px;
    width: 400px;
    max-width: 400px;

    & a {
        color: #1264a3;
        text-decoration: none;
        font-weight: 700;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default SignUp;
