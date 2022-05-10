import axios from 'axios';
import useSWR from 'swr';

export function useCommonSWR<T = any>(url: string) {
    return useSWR(
        url,
        (url) =>
            axios
                .get<T>(url, { withCredentials: true })
                .then((response) => response.data),
        { dedupingInterval: 30000 }
    );
}

export function post<T = void>(url: string, data?: any) {
    return axios.post<T>(url, data, {
        withCredentials: true
    });
}
