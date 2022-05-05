import { IChannel, IChannelGroup, IUser } from '@/types';
import { rest } from 'msw';

const dummyChannels: IChannelGroup[] = [
    {
        id: 1,
        name: 'Category1',
        channels: [
            { id: 1, type: 'chatting', name: 'Channel1' },
            { id: 2, type: 'chatting', name: 'Channel2' },
            { id: 3, type: 'board-sharing', name: 'Channel3' },
            { id: 4, type: 'board-sharing', name: 'Channel4' }
        ]
    },
    {
        id: 2,
        name: 'Category2',
        channels: [
            { id: 5, type: 'web-sharing', name: 'Channel1' },
            { id: 6, type: 'web-sharing', name: 'Channel2' },
            { id: 7, type: 'web-sharing', name: 'Channel3' },
            { id: 8, type: 'web-sharing', name: 'Channel4' }
        ]
    }
];

const authHandlers = [
    rest.get<IUser>('/api/user/me', async (req, res, ctx) => {
        return res(
            ctx.json<IUser>({
                userId: 'jo',
                username: 'Sleeeeeepy',
                avatarUrl:
                    'https://gaon.com/image/profile?username=jo&hashtag=1234',
                email: 'jo@mail.com',
                name: '정민',
                status: 'online',
                job: 'Project Manager'
            })
        );
    }),
    rest.post<{
        email: string;
        password: string;
    }>('/api/auth/login', async (req, res, ctx) => {
        const { email, password } = req.body;

        if (email !== '1@1.1' || password !== '1') {
            return res(ctx.status(401));
        }

        return res(
            ctx.json<IUser>({
                userId: 'jo',
                username: 'Sleeeeeepy',
                avatarUrl:
                    'https://gaon.com/image/profile?username=jo&hashtag=1234',
                email: 'jo@mail.com',
                name: '정민',
                status: 'online',
                job: 'Project Manager'
            })
        );
    })
];

const workspaceHandlers = [
    rest.get('/api/workspace/:workspaceId/channels', async (req, res, ctx) => {
        const { workspaceId } = req.params;
        return res(ctx.json<IChannelGroup[]>(dummyChannels));
    }),
    rest.get(
        '/api/workspace/:workspaceId/channels/:channelId',
        async (req, res, ctx) => {
            const { workspaceId, channelId } = req.params;
            let channel;
            for (let group of dummyChannels) {
                channel = group.channels.find(
                    (channel) => channel.id === +channelId
                );
                if (channel !== undefined) {
                    break;
                }
            }
            return res(ctx.json<IChannel | undefined>(channel));
        }
    )
];

export const handlers = authHandlers.concat(workspaceHandlers);
