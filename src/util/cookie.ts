import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export function setCookie(name: string, value: any, option?: any) {
    return cookies.set(name, value, { ...option });
}

export function getCookie<T>(name: string, option?: any): T {
    return cookies.get(name, { ...option });
}
