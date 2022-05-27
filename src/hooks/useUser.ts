import { useUsersSWR } from '@/api/auth';
import { useCookies } from 'react-cookie';
import { IUserIdentifier } from '@/types';

/**
 * 현재 접속되어있는 내 정보 확인
 */
export default function useUser() {
    const [cookies, setCookie, removeCookie] = useCookies(['usr']);
    const { data: user, error: swrError } = useUsersSWR(
        cookies.usr?.userId,
        cookies.usr?.token
    );

    const error = cookies.usr ? swrError : 'No login data';

    return {
        user,
        identifier: cookies.usr as IUserIdentifier,
        isLoading: !user && !error,
        setCookie: (cookie: IUserIdentifier | undefined) => {
            if (!cookie) {
                removeCookie('usr');
            } else {
                setCookie('usr', cookie);
            }
        }
    };
}
