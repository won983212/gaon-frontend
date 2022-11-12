import { IChannel, IChannelGroup, IUserSummary } from '@/types';
import { rest } from 'msw';

const dummyChannels: IChannelGroup[] = [
    {
        id: 1,
        name: 'Group1'
    },
    {
        id: 2,
        name: 'Group2'
    }
];

const dummyAdmins: IUserSummary[] = [
    {
        id: 1,
        name: 'psvm'
    },
    {
        id: 2,
        name: 'psvm2'
    }
];

const workspaceHandlers = [
    rest.get('/api/workspace/:workspaceId/channels', async (req, res, ctx) => {
        return res(ctx.json<IChannelGroup[]>(dummyChannels));
    }),
    rest.get('/api/channels/:channelId', async (req, res, ctx) => {
        const { channelId } = req.params;
        return res(
            ctx.json<IChannel>({
                id: +channelId,
                type: 'chatting',
                name: 'Chatting1'
            })
        );
    }),
    rest.get('/api/user/admin', async (req, res, ctx) => {
        return res(ctx.json<IUserSummary[]>(dummyAdmins));
    })
];

export const handlers = workspaceHandlers;
