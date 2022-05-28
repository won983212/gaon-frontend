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
import useRoom from '@/hooks/useRoom';

function Login() {
    const { user, isLoading, setCookie } = useUser();
    const { setWorkspaceId } = useRoom();
    const [logInError, setLogInError] = useState<string | undefined>(undefined);
    const [id, onChangeID] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLogInError(undefined);
            doLogin(id, password)
                .then((response) => {
                    setCookie({
                        userId: response.data.userId,
                        token: response.data.token
                    });
                })
                .catch((error) => {
                    setLogInError(error.response.data.message);
                });
        },
        [id, password, setCookie]
    );

    if (user) {
        setWorkspaceId(0); // TODO set as default workspace
        return <Navigate replace to="/workspace/channel" />;
    }

    if (isLoading) {
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
                        {logInError && <Error>{logInError}</Error>}
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
