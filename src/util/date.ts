import dayjs from 'dayjs';

export function unixToDate(unixTimestamp: number) {
    return dayjs(unixTimestamp).format('YYYY-MM-DD HH:MM:SS');
}

export function dateToUnix(date: string) {
    return dayjs(date).unix();
}
