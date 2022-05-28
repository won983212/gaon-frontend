import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const connectedSockets: { [key: string]: Socket } = {};

/**
 * 전역적으로 상태관리되고 있는 소켓 리턴. path별로 관리함.
 * 같은 path에 대해서 useSocket하면, 항상 동일한 socket 리턴.
 * @param workspaceId Websocket endpoint (workspaceId)
 * @return [socket, disconnectFunc]
 */
const useSocket = (workspaceId?: number): [Socket, () => void] => {
    if (workspaceId === undefined || workspaceId === null) {
        throw new Error('Invaild workspaceId');
    }

    const disconnect = useCallback(() => {
        if (connectedSockets[workspaceId]) {
            connectedSockets[workspaceId].disconnect();
        }
        delete connectedSockets[workspaceId];
    }, [workspaceId]);

    if (!connectedSockets[workspaceId]) {
        connectedSockets[workspaceId] = io(`/workspace-${workspaceId}`, {
            path: '/ws/socket.io',
            transports: ['websocket']
        });
    }

    return [connectedSockets[workspaceId], disconnect];
};

export default useSocket;
