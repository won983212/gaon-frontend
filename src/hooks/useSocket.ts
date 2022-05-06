import io, { Socket } from 'socket.io-client';
import { useCallback } from 'react';

const webSocketUrl = 'http://localhost:3095';
const connectedSockets: { [key: string]: Socket } = {};

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
