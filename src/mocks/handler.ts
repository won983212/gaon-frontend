import { IChannel, IChannelGroup, IFileNode } from '@/types';
import { rest } from 'msw';

const dummyChannels: IChannelGroup[] = [
    {
        id: 1,
        name: 'Group1',
        channels: [
            { id: 1, type: 'chatting', name: 'Chatting1' },
            { id: 2, type: 'chatting', name: 'Chatting2' },
            { id: 3, type: 'chatting', name: 'Chatting3' },
            { id: 4, type: 'conference', name: 'Conference1' }
        ]
    },
    {
        id: 2,
        name: 'Group2',
        channels: [
            { id: 5, type: 'chatting', name: 'Chatting1' },
            { id: 6, type: 'chatting', name: 'Chatting2' },
            { id: 7, type: 'conference', name: 'Conference1' },
            { id: 8, type: 'conference', name: 'Conference2' }
        ]
    }
];

const dummyFiles: IFileNode[] = [
    { name: 'public', files: [] },
    {
        name: 'src',
        files: [
            {
                name: 'api',
                files: [
                    { name: 'auth.ts' },
                    { name: 'client.ts' },
                    { name: 'conference.ts' },
                    { name: 'workspace.ts' }
                ]
            },
            {
                name: 'hooks',
                files: [
                    { name: 'useChannel.ts' },
                    { name: 'useInput.ts' },
                    { name: 'useSocket.ts' },
                    { name: 'withDefault.ts' }
                ]
            },
            {
                name: 'layouts',
                files: [
                    {
                        name: 'Workspace',
                        files: [{ name: 'index.tsx' }, { name: 'style.ts' }]
                    },
                    { name: 'App.tsx' }
                ]
            },
            {
                name: 'mocks',
                files: [{ name: 'browser.ts' }, { name: 'handler.ts' }]
            }
        ]
    },
    { name: '.eslintrc' },
    { name: '.gitignore' },
    { name: 'package.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' }
];

/*const authHandlers = [
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
];*/

const workspaceHandlers = [
    rest.get('/api/workspace/:workspaceId/channels', async (req, res, ctx) => {
        return res(ctx.json<IChannelGroup[]>(dummyChannels));
    }),
    rest.get(
        '/api/workspace/:workspaceId/channels/:channelId',
        async (req, res, ctx) => {
            const { channelId } = req.params;
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
    ),
    rest.get('/api/workspace/:workspaceId/files', async (req, res, ctx) => {
        return res(ctx.json<IFileNode[]>(dummyFiles));
    })
];

//export const handlers = authHandlers.concat(workspaceHandlers);
export const handlers = workspaceHandlers;
