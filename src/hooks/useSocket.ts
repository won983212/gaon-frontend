import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const connectedSockets: { [key: string]: Socket } = {};

export type SocketType = 'voice' | 'main';

/**
 * 전역적으로 상태관리되고 있는 소켓 리턴. path별로 관리함.
 * 같은 path에 대해서 useSocket하면, 항상 동일한 socket 리턴.
 * @param workspaceId Websocket endpoint (workspaceId)
 * @param type WebSocket type
 * @return [socket, disconnectFunc]
 */
const useSocket = (
    workspaceId?: number,
    type: SocketType = 'main'
): [Socket, () => void] => {
    if (workspaceId === undefined || workspaceId === null) {
        throw new Error('Invaild workspaceId');
    }

    const key = workspaceId + type;
    const disconnect = useCallback(() => {
        if (connectedSockets[key]) {
            connectedSockets[key].disconnect();
        }
        delete connectedSockets[key];
    }, [key]);

    if (!connectedSockets[key]) {
        if (type === 'main') {
            connectedSockets[key] = io(`/workspace-${workspaceId}`, {
                path: '/ws/socket.io',
                transports: ['websocket']
            });
        } else if (type === 'voice') {
            connectedSockets[key] = io('ws://localhost:8081');
        }
    }

    return [connectedSockets[key], disconnect];
};

export default useSocket;
