import { useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import useInput from '@/hooks/useInput';
import { getUsersSWR, doLogin } from '@/api/auth';

function Login() {
    const { data, error, mutate } = getUsersSWR();
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
        <LoginContainer id="container">
            <LoginForm>
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
                    <Button type="submit">로그인</Button>
                </Form>
            </LoginForm>
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    text-align: center;
    margin-top: 50px;
`;

const LoginForm = styled.div`
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

export default Login;
