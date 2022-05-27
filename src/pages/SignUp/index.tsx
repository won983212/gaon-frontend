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
    LinkContainer
} from '../Login/style';
import { useNavigate } from 'react-router';

function SignUp() {
    const navigate = useNavigate();
    const [id, onChangeID] = useInput('');
    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [name, onChangeName] = useInput('');
    const [birthday, setBirthday] = useState<number | undefined>(undefined);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [signUpError, setSignUpError] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            setSignUpError('아이디를 입력하세요.');
        } else if (!password) {
            setSignUpError('비밀번호를 입력하세요.');
        } else if (!email) {
            setSignUpError('이메일를 입력하세요.');
        } else if (!nickname) {
            setSignUpError('닉네임을 입력하세요.');
        } else {
            doSignUp(id, password, nickname, email, name, birthday)
                .then(() => {
                    navigate('/');
                    setSignUpError('');
                })
                .catch((error) => {
                    setSignUpError(error.response.data.message);
                });
        }
    };

    const onChangeBirthday = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setBirthday(Math.floor(new Date(e.target.value).getTime() / 1000));
        },
        []
    );

    const onChangePassword = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            setSignUpError(
                e.target.value !== passwordCheck
                    ? '비밀번호가 일치하지 않습니다.'
                    : ''
            );
        },
        [passwordCheck]
    );

    const onChangePasswordCheck = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordCheck(e.target.value);
            setSignUpError(
                e.target.value !== password
                    ? '비밀번호가 일치하지 않습니다.'
                    : ''
            );
        },
        [password]
    );

    return (
        <FormContainer id="container">
            <FormWrapper>
                <Header>Gaon</Header>
                <Form onSubmit={onSubmit}>
                    <Label id="id-label">
                        <span>아이디 *</span>
                        <div>
                            <Input
                                type="text"
                                id="id"
                                name="id"
                                value={id}
                                onChange={onChangeID}
                            />
                        </div>
                    </Label>
                    <Label id="password-label">
                        <span>비밀번호 *</span>
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
                        <span>비밀번호 확인 *</span>
                        <div>
                            <Input
                                type="password"
                                id="password-check"
                                name="password-check"
                                value={passwordCheck}
                                onChange={onChangePasswordCheck}
                            />
                        </div>
                    </Label>
                    <Label id="email-label">
                        <span>이메일 주소 *</span>
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
                        <span>닉네임 *</span>
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
                    <Label id="name-label">
                        <span>이름</span>
                        <div>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={onChangeName}
                            />
                        </div>
                    </Label>
                    <Label id="birth-label">
                        <span>생일</span>
                        <div>
                            <Input
                                type="date"
                                id="birth"
                                name="birth"
                                onChange={onChangeBirthday}
                            />
                        </div>
                    </Label>

                    {signUpError && <Error>{signUpError}</Error>}

                    <LinkContainer>
                        이미 회원이라면?&nbsp;
                        <Link to="/login">로그인</Link>
                    </LinkContainer>
                    <Button type="submit" fullWidth>
                        회원가입
                    </Button>
                </Form>
            </FormWrapper>
        </FormContainer>
    );
}

export default SignUp;
