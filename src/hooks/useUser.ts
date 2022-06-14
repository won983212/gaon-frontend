import { useCookies } from 'react-cookie';
import { IUserIdentifier } from '@/types';
import { useUsersSWR } from '@/api/user';
import dayjs from 'dayjs';

export function useUserCookie() {
    const [cookies, setCookie, removeCookie] = useCookies(['usr']);

    return [
        cookies.usr,
        (cookie: IUserIdentifier | undefined) => {
            if (!cookie) {
                removeCookie('usr');
            } else {
                setCookie('usr', cookie, {
                    expires: dayjs().add(30, 'minutes').toDate()
                });
            }
        }
    ];
}

/**
 * 현재 접속되어있는 내 정보 확인
 */
export default function useUser() {
    const [userCookie, setCookie] = useUserCookie();
    const { data: user, error: swrError } = useUsersSWR(
        userCookie?.userId,
        userCookie?.token
    );

    const error = userCookie ? swrError : 'No login data';

    return {
        user,
        error,
        identifier: userCookie as IUserIdentifier,
        isLoadingUser: !user && !error,
        setCookie
    };
}
