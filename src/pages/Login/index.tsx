import { doLogin, useUsersSWR } from '@/api/auth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useInput from '@/hooks/useInput';
import { useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    Error,
    Form,
    FormContainer,
    FormWrapper,
    Header,
    Label,
    LinkContainer
} from './style';

function Login() {
    const { data, mutate } = useUsersSWR();
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLogInError(false);
            doLogin(email, password)
                .then((response) => {
                    mutate(response.data, false);
                })
                .catch((error) => {
                    setLogInError(error.response.status === 401);
                });
        },
        [email, password, mutate]
    );

    if (data === undefined) {
        return <div>Loading...</div>;
    }

    if (data) {
        return <Navigate replace to="/workspace/channel" />;
    }

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
                        {logInError && (
                            <Error>
                                이메일과 비밀번호 조합이 일치하지 않습니다.
                            </Error>
                        )}
                    </Label>

                    <LinkContainer>
                        아이디가 없다면&nbsp;
                        <Link to="/signup">회원가입</Link>
                    </LinkContainer>
                    <Button type="submit" fullWidth>
                        로그인
                    </Button>
                </Form>
            </FormWrapper>
        </FormContainer>
    );
}

export default Login;
