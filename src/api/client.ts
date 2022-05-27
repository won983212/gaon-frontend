import axios, { AxiosRequestHeaders } from 'axios';
import useSWR from 'swr';
import apiconfig from '@/apiconfig.json';

export function useHTTPGetSWR<T = any>(
    url?: string,
    headers?: AxiosRequestHeaders
) {
    return useSWR(
        url,
        (url) =>
            axios
                .get<T>(url, { headers: headers, withCredentials: true })
                .then((response) => response.data),
        { dedupingInterval: 30000 }
    );
}

export function apiUrl(path: string) {
    return apiconfig.host + path;
}

export function post<T = void>(
    url: string,
    data?: any,
    headers?: AxiosRequestHeaders
) {
    return axios.post<T>(url, data, {
        headers: headers,
        withCredentials: true
    });
}
