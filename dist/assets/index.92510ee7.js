import{a as E,s as a}from"./styled-components.browser.esm.db5bdad4.js";import{u as C}from"./useInput.253bd7ba.js";import{r as o,j as e,a as n,L as A}from"./index.ca6c3dbc.js";function G(){const[d,x]=C(""),[i,m]=C(""),[t,b]=o.exports.useState(""),[p,f]=o.exports.useState(""),[w,h]=o.exports.useState(!1),[v,k]=o.exports.useState(!1),[g,B]=o.exports.useState(""),S=o.exports.useCallback(r=>{r.preventDefault(),E(d,i,t).then(c=>{k(c.data==="ok")}).catch(c=>{B(c.response.data)})},[d,i,t]),D=o.exports.useCallback(r=>{b(r.target.value),h(r.target.value!==p)},[p]),y=o.exports.useCallback(r=>{f(r.target.value),h(t!==r.target.value)},[t]);return e(U,{id:"container",children:n(_,{children:[e(F,{children:"Gaon"}),n(z,{onSubmit:S,children:[n(s,{id:"email-label",children:[e("span",{children:"\uC774\uBA54\uC77C \uC8FC\uC18C"}),e("div",{children:e(u,{type:"email",id:"email",name:"email",value:d,onChange:x})})]}),n(s,{id:"nickname-label",children:[e("span",{children:"\uB2C9\uB124\uC784"}),e("div",{children:e(u,{type:"text",id:"nickname",name:"nickname",value:i,onChange:m})})]}),n(s,{id:"password-label",children:[e("span",{children:"\uBE44\uBC00\uBC88\uD638"}),e("div",{children:e(u,{type:"password",id:"password",name:"password",value:t,onChange:D})})]}),n(s,{id:"password-check-label",children:[e("span",{children:"\uBE44\uBC00\uBC88\uD638 \uD655\uC778"}),e("div",{children:e(u,{type:"password",id:"password-check",name:"password-check",value:p,onChange:y})}),w&&e(l,{children:"\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),!i&&e(l,{children:"\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."}),g&&e(l,{children:g}),v&&e(P,{children:"\uD68C\uC6D0\uAC00\uC785\uB418\uC5C8\uC2B5\uB2C8\uB2E4! \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694."})]}),n(j,{children:["\uC774\uBBF8 \uD68C\uC6D0\uC774\uB77C\uBA74?\xA0",e(A,{to:"/login",children:"\uB85C\uADF8\uC778"})]}),e(L,{type:"submit",children:"\uD68C\uC6D0\uAC00\uC785"})]})]})})}const U=a.div`
    text-align: center;
    margin-top: 50px;
`,_=a.div`
    background-color: white;
    display: inline-block;
    border-radius: 20px;
    padding: 40px;
`,F=a.header`
    text-align: center;
    font-family: Slack-Larsseit, Helvetica Neue, Helvetica, Segoe UI, Tahoma,
        Arial, sans-serif;
    font-weight: 700;
    font-size: 48px;
    line-height: 46px;
    letter-spacing: -0.75px;
    margin-top: 50px;
    margin-bottom: 50px;
`,z=a.form`
    margin: 0 auto;
    width: 400px;
    max-width: 400px;
`,s=a.label`
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
`,u=a.input`
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
`,L=a.button`
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
`,l=a.div`
    color: #e01e5a;
    margin: 8px 0 16px;
    font-weight: bold;
`,P=a.div`
    color: #2eb67d;
    font-weight: bold;
`,j=a.p`
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
`;export{G as default};
