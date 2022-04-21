import styled from 'styled-components';

export const FormContainer = styled.div`
    text-align: center;
    margin-top: 50px;
`;

export const FormWrapper = styled.div`
    background-color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 40px;
`;

export const Header = styled.header`
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

export const Form = styled.form`
    margin: 0 auto;
    width: 400px;
    max-width: 400px;
`;

export const Label = styled.label`
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

export const Error = styled.div`
    color: #e01e5a;
    margin: 8px 0 16px;
    font-weight: bold;
`;

export const Success = styled.div`
    color: #2eb67d;
    font-weight: bold;
`;

export const LinkContainer = styled.p`
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
