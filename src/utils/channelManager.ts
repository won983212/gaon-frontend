import { Channels } from '../layouts/Workspace';
import { ChannelType } from './types';

export const Channels1: ChannelType[] = [
    {
        id: 1,
        name: 'CH1'
    },
    {
        id: 2,
        name: 'CH2'
    },
    {
        id: 3,
        name: 'CH33'
    },
    {
        id: 4,
        name: 'CH4'
    }
];

export const Channels2: ChannelType[] = [
    {
        id: 5,
        name: 'CH5'
    },
    {
        id: 6,
        name: 'CH6'
    },
    {
        id: 7,
        name: 'CH7'
    },
    {
        id: 8,
        name: 'CH8'
    }
];

export function getChannelNameById(id: number): string | undefined {
    return Channels1.concat(Channels2).find((e) => e.id === id)?.name;
}
