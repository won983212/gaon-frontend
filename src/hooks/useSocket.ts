import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const webSocketUrl = 'http://localhost:3095';
const connectedSockets: { [key: string]: Socket } = {};

/**
 * 전역적으로 상태관리되고 있는 소켓 리턴. path별로 관리함.
 * 같은 path에 대해서 useSocket하면, 항상 동일한 socket 리턴.
 * @param path Websocket endpoint
 * @return [socket, disconnectFunc]
 */
const useSocket = (path: string): [Socket | undefined, () => void] => {
    const disconnect = useCallback(() => {
        if (path) {
            connectedSockets[path].disconnect();
        }
        delete connectedSockets[path];
    }, [path]);
    if (!path) {
        return [undefined, disconnect];
    }
    if (!connectedSockets[path]) {
        connectedSockets[path] = io(`${webSocketUrl}/${path}`, {
            transports: ['websocket']
        });
    }
    return [connectedSockets[path], disconnect];
};

export default useSocket;
