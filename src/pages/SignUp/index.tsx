import { doSignUp } from '@/api/auth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useInput from '@/hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Error,
    Form,
    FormContainer,
    FormWrapper,
    Header,
    Label,
    LinkContainer,
    Success
} from '../Login/style';

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
        <FormContainer id="container">
            <FormWrapper>
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
            </FormWrapper>
        </FormContainer>
    );
}

export default SignUp;
