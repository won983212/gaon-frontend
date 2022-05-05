import { IChannelCategory, IUser } from '@/types';
import { rest } from 'msw';

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
        return res(
            ctx.json<IChannelCategory[]>([
                {
                    id: 1,
                    name: 'Category1',
                    channels: [
                        { id: 1, name: 'Channel1' },
                        { id: 2, name: 'Channel2' },
                        { id: 3, name: 'Channel3' },
                        { id: 4, name: 'Channel4' }
                    ]
                },
                {
                    id: 2,
                    name: 'Category2',
                    channels: [
                        { id: 5, name: 'Channel1' },
                        { id: 6, name: 'Channel2' },
                        { id: 7, name: 'Channel3' },
                        { id: 8, name: 'Channel4' }
                    ]
                }
            ])
        );
    })
];

export const handlers = authHandlers.concat(workspaceHandlers);
