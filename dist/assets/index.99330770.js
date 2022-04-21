import{W as o,g as i}from"./Workspace.57977ab1.js";import{s as e}from"./styled-components.browser.esm.db5bdad4.js";import{u as n,j as r}from"./index.ca6c3dbc.js";function d(){const{channelId:a}=n(),t=a?+a:0;return r(o,{children:r(s,{children:i(t)})})}const h=e.div`
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 38px);
    flex-flow: column;
    position: relative;
`,s=e.header`
    height: 64px;
    display: flex;
    width: 100%;
    background-color: var(--primary-dark);
    color: white;
    border-left: 1px solid var(--primary-light);
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 1px 0 var(--saf-0);
    padding: 20px 16px 20px 20px;
    font-weight: bold;
    align-items: center;
`,f=e.div`
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100% - 64px);
    background: white;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
`;export{h as Container,f as DragOver,s as Header,d as default};
