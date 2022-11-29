import { doLogin } from '@/api/auth';
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
import useUser from '@/hooks/useUser';

interface LoginPageProps {
    redirectTo?: string;
}

function Login({ redirectTo }: LoginPageProps) {
    const { user, isLoadingUser, setCookie } = useUser();
    const [logInError, setLogInError] = useState<string | undefined>(undefined);
    const [id, onChangeID] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!id) {
                setLogInError('아이디를 입력하세요.');
            } else if (!password) {
                setLogInError('비밀번호를 입력하세요.');
            } else {
                setLogInError(undefined);
                doLogin(id, password)
                    .then((response) => {
                        setCookie({
                            userId: response.data.userId,
                            token: response.data.token
                        });
                    })
                    .catch((error) => {
                        const message = error.response.data;
                        if (message) {
                            setLogInError(message);
                        } else {
                            setLogInError(error.message);
                        }
                    });
            }
        },
        [id, password, setCookie]
    );

    if (user) {
        return <Navigate replace to={redirectTo ?? '/workspace'} />;
    }

    if (isLoadingUser) {
        return <p>Loading...</p>;
    }

    return (
        <FormContainer id="container">
            <FormWrapper>
                <Header>Gaon</Header>
                <Form onSubmit={onSubmit}>
                    <Label id="id-label">
                        <span>아이디</span>
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
                    {logInError && <Error>{logInError}</Error>}

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
