import useSWR from 'swr';

let tabIndex = 0;
export default function useConferenceTabIndex() {
    const { data, mutate } = useSWR<number>('conference-tab', () => {
        return tabIndex;
    });
    return {
        data,
        mutate: (tabIdx: number) => {
            tabIndex = tabIdx;
            return mutate();
        }
    };
}
