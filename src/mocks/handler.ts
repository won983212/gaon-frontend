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

var lastId = 7;
var dummyAdmins: IUserSummary[] = [
    {
        id: 1,
        name: 'psvm'
    },
    {
        id: 2,
        name: 'psvm2'
    },
    {
        id: 3,
        name: 'psvm2'
    },
    {
        id: 4,
        name: 'psvm2'
    },
    {
        id: 5,
        name: 'psvm2'
    },
    {
        id: 6,
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
    }),
    rest.post('/api/user/admin', async (req, res, ctx) => {
        // @ts-ignore
        const { newAdminUsername } = req.body;
        const newAdmin: IUserSummary = {
            id: lastId++,
            name: newAdminUsername
        };
        dummyAdmins.push(newAdmin);
        return res(ctx.json<IUserSummary>(newAdmin));
    }),
    rest.delete('/api/user/admin', async (req, res, ctx) => {
        // @ts-ignore
        const { adminUserId } = req.body;
        const itemIdx = dummyAdmins.findIndex(
            (admin) => admin.id === adminUserId
        );
        if (itemIdx > -1) {
            dummyAdmins.splice(itemIdx, 1);
            return res(ctx.status(200));
        } else {
            return res(ctx.status(401));
        }
    })
];

export const handlers = workspaceHandlers;
