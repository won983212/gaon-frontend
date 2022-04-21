import{g as b,d as f,s as r}from"./styled-components.browser.esm.db5bdad4.js";import{u}from"./useInput.253bd7ba.js";import{r as p,j as o,N as v,a,L as w}from"./index.ca6c3dbc.js";function S(){const{data:t,error:D,mutate:s}=b(),[g,d]=p.exports.useState(!1),[e,h]=u(""),[n,x]=u(""),m=p.exports.useCallback(C=>{C.preventDefault(),d(!1),f(e,n).then(i=>{s(i.data,!1)}).catch(i=>{d(i.response.status===401)})},[e,n,s]);return t===void 0?o("div",{children:"Loading..."}):t?o(v,{replace:!0,to:"/workspace/channel"}):o(k,{id:"container",children:a(B,{children:[o(y,{children:"Gaon"}),a(L,{onSubmit:m,children:[a(l,{id:"email-label",children:[o("span",{children:"\uC774\uBA54\uC77C \uC8FC\uC18C"}),o("div",{children:o(c,{type:"email",id:"email",name:"email",value:e,onChange:h})})]}),a(l,{id:"password-label",children:[o("span",{children:"\uBE44\uBC00\uBC88\uD638"}),o("div",{children:o(c,{type:"password",id:"password",name:"password",value:n,onChange:x})}),g&&o(E,{children:"\uC774\uBA54\uC77C\uACFC \uBE44\uBC00\uBC88\uD638 \uC870\uD569\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."})]}),a(_,{children:["\uC544\uC774\uB514\uAC00 \uC5C6\uB2E4\uBA74\xA0",o(w,{to:"/signup",children:"\uD68C\uC6D0\uAC00\uC785"})]}),o(A,{type:"submit",children:"\uB85C\uADF8\uC778"})]})]})})}const k=r.div`
    text-align: center;
    margin-top: 50px;
`,B=r.div`
    background-color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 40px;
`,y=r.header`
    text-align: center;
    font-family: Slack-Larsseit, Helvetica Neue, Helvetica, Segoe UI, Tahoma,
        Arial, sans-serif;
    font-weight: 700;
    font-size: 48px;
    line-height: 46px;
    letter-spacing: -0.75px;
    margin-top: 50px;
    margin-bottom: 50px;
`,L=r.form`
    margin: 0 auto;
    width: 400px;
    max-width: 400px;
`,l=r.label`
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
`,c=r.input`
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
`,A=r.button`
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
`,E=r.div`
    color: #e01e5a;
    margin: 8px 0 16px;
    font-weight: bold;
`,_=r.p`
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
`;export{S as default};
