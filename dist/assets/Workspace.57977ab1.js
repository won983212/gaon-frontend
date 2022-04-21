import{s as o,g as N,b as H}from"./styled-components.browser.esm.db5bdad4.js";import{R as c,a as p,b,j as a,r as f,F as M,N as O}from"./index.ca6c3dbc.js";var w={exports:{}};/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/(function(e){(function(){var n={}.hasOwnProperty;function t(){for(var r=[],i=0;i<arguments.length;i++){var l=arguments[i];if(!!l){var h=typeof l;if(h==="string"||h==="number")r.push(l);else if(Array.isArray(l)){if(l.length){var u=t.apply(null,l);u&&r.push(u)}}else if(h==="object")if(l.toString===Object.prototype.toString)for(var s in l)n.call(l,s)&&l[s]&&r.push(s);else r.push(l.toString())}}return r.join(" ")}e.exports?(t.default=t,e.exports=t):window.classNames=t})()})(w);var j=w.exports,y={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},x=c.createContext&&c.createContext(y),d=globalThis&&globalThis.__assign||function(){return d=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++){n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},d.apply(this,arguments)},S=globalThis&&globalThis.__rest||function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)n.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(t[r[i]]=e[r[i]]);return t};function C(e){return e&&e.map(function(n,t){return c.createElement(n.tag,d({key:t},n.attr),C(n.child))})}function g(e){return function(n){return c.createElement(E,d({attr:d({},e.attr)},n),C(e.child))}}function E(e){var n=function(t){var r=e.attr,i=e.size,l=e.title,h=S(e,["attr","size","title"]),u=i||t.size||"1em",s;return t.className&&(s=t.className),e.className&&(s=(s?s+" ":"")+e.className),c.createElement("svg",d({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,r,h,{className:s,style:d(d({color:e.color||t.color},t.style),e.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),l&&c.createElement("title",null,l),e.children)};return x!==void 0?c.createElement(x.Consumer,null,function(t){return n(t)}):n(y)}function I(e){return g({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"}}]})(e)}function P(e){return g({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"}}]})(e)}function V(e){return g({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0V0z"}},{tag:"path",attr:{d:"M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"}}]})(e)}function _({channel:e}){return p(b,{to:`/workspace/channel/${e.id}`,className:n=>n.isActive?"menuitem selected":"menuitem",children:[a(W,{children:a(I,{})}),a("h2",{children:e.name})]},e.id)}const W=o.div`
    margin-right: 8px;
`;function m({channels:e}){const[n,t]=f.exports.useState(!1),r=f.exports.useCallback(()=>{t(i=>!i)},[]);return p(M,{children:[p("h2",{children:[a("button",{className:j("btn-collapse",{open:!n}),onClick:r,children:a(P,{})}),a("span",{children:"List"})]}),a("div",{children:!n&&e.map(i=>a(_,{channel:i},i.id))})]})}function A(){return a("div",{className:"menu-item",children:a(b,{to:"/workspace/channel/1",children:p("h2",{children:[a("div",{className:"menu-icon",children:a(V,{})}),a("span",{children:"Dashboard"})]})})})}const k=[{id:1,name:"CH1"},{id:2,name:"CH2"},{id:3,name:"CH33"},{id:4,name:"CH4"}],z=[{id:5,name:"CH5"},{id:6,name:"CH6"},{id:7,name:"CH7"},{id:8,name:"CH8"}];function F(e){var n;return(n=k.concat(z).find(t=>t.id===e))==null?void 0:n.name}function $({children:e}){const{data:n,error:t,mutate:r}=N();return f.exports.useCallback(()=>{H().then(()=>{r(void 0,!1)})},[r]),n?a("div",{children:p(B,{children:[p(L,{children:[a(v,{children:"Project Area"}),p(T,{children:[a(A,{}),a(m,{channels:k}),a(m,{channels:z})]}),a(v,{children:"Profile Area"})]}),e]})}):a(O,{replace:!0,to:"/login"})}o.div`
    float: right;
`;o.header`
    height: 38px;
    background: var(--primary);
    color: #ffffff;
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
    padding: 5px;
    text-align: center;
`;o.img`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 5px;
    right: 16px;
`;o.div`
    display: flex;
    padding: 20px;

    & img {
        display: flex;
    }

    & > div {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    & #profile-name {
        font-weight: bold;
        display: inline-flex;
    }

    & #profile-active {
        font-size: 13px;
        display: inline-flex;
    }
`;o.button`
    border: none;
    width: 100%;
    border-top: 1px solid rgb(29, 28, 29);
    background: transparent;
    display: block;
    height: 33px;
    padding: 5px 20px 5px;
    outline: none;
    cursor: pointer;
`;const B=o.div`
    display: flex;
    flex: 1;
`;o.div`
    width: 65px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: var(--primary);
    border-top: 1px solid var(--primary-light);
    border-right: 1px solid var(--primary-light);
    vertical-align: top;
    text-align: center;
    padding: 15px 0 0;
`;const L=o.nav`
    width: 260px;
    display: inline-flex;
    flex-direction: column;
    background: var(--primary);
    color: var(--text);
    vertical-align: top;

    & .menuitem {
        padding-left: 36px;
        color: inherit;
        text-decoration: none;
        height: 28px;
        line-height: 28px;
        display: flex;
        align-items: center;

        &.selected {
            color: white;
        }
    }

    & .bold {
        color: white;
        font-weight: bold;
    }

    & .count {
        margin-left: auto;
        background: #cd2553;
        border-radius: 16px;
        display: inline-block;
        font-size: 12px;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
        padding: 0 9px;
        color: white;
        margin-right: 16px;
    }

    & h2 {
        height: 36px;
        line-height: 36px;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 15px;
    }
`,v=o.button`
    height: 64px;
    line-height: 64px;
    border: none;
    width: 100%;
    text-align: left;
    border-top: 1px solid var(--primary-light);
    border-bottom: 1px solid var(--primary-light);
    font-weight: 900;
    font-size: 24px;
    background: var(--primary-dark);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 0;
    padding-left: 16px;
    margin: 0;
    color: white;
    cursor: pointer;
`,T=o.div`
    margin-top: 16px;
    height: calc(100vh - 144px);
    overflow-y: auto;
`;o.div`
    padding: 10px 0 0;

    & h2 {
        padding-left: 20px;
    }

    & > button {
        width: 100%;
        height: 28px;
        padding: 4px;
        border: none;
        background: transparent;
        border-top: 1px solid rgb(28, 29, 28);
        cursor: pointer;

        &:last-of-type {
            border-bottom: 1px solid rgb(28, 29, 28);
        }
    }
`;o.div`
    flex: 1;
`;o.button`
    color: white;
    font-size: 24px;
    display: inline-block;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
`;o.button`
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    border: 3px solid #3f0e40;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 700;
    color: black;
    cursor: pointer;
`;export{$ as W,F as g};
