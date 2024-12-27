import { ChatRoom } from '@/types/Chatroom';

export const fetchChatRoomsAsync = async (token: string) => {
    return new Promise<ChatRoom[]>((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', name: 'General' },
                { id: '2', name: 'Tech Talk' },
            ]);
        }, 1000);
    });
};

export const createChatRoomAsync = async (name: string, token: string) => {
    return new Promise<ChatRoom>((resolve) => {
        setTimeout(() => {
            resolve({ id: '5', name });
        }, 1000);
    });
}

export const findChatRoomAsync = async (id: string, token: string) => {
    return new Promise<ChatRoom>((resolve) => {
        setTimeout(() => {
            resolve({ id, name: 'Random' });
        }, 1000);
    });
}