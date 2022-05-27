import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import useSWR from 'swr';
import apiconfig from '@/config.json';

export function useHTTPGetSWR<T = any>(
    url?: string,
    headers?: AxiosRequestHeaders
) {
    return useSWR(
        url && apiUrl(url),
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
    if (!url) {
        return new Promise<AxiosResponse<T>>(() => {});
    }
    return axios.post<T>(apiUrl(url), data, {
        headers: headers,
        withCredentials: true
    });
}
