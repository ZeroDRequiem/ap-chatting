import { RootState } from '@/store';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { ChatRoom } from '@/types/Chatroom';
import { fetchChatRoomsAsync, createChatRoomAsync, findChatRoomAsync } from '@/services/chatrooms.api';

type ChatRoomsState = {
    chatRooms: ChatRoom[];
    loading: boolean;
    error: string | null;
    fetched: boolean;
}

const initialState: ChatRoomsState = {
    chatRooms: [],
    loading: false,
    error: null,
    fetched: false
}

export const fetchChatRooms = createAsyncThunk(
    'chatRooms/fetchChatRooms',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.user.token!;
            return await fetchChatRoomsAsync(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat rooms');
        }
    }
);

export const createChatRoom = createAsyncThunk(
    'chatRooms/createChatRoom',
    async (name: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.user.token!;
            return await createChatRoomAsync(name, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create chat room');
        }
    }
);

export const findChatRoom = createAsyncThunk(
    'chatRooms/findChatRoom',
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.user.token!;
            return await findChatRoomAsync(id, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat room');
        }
    }
);

const chatRoomsSlice = createSlice({
    name: 'chatRooms',
    initialState,
    reducers: {
        clear: (state) => {
            state.chatRooms = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                state.chatRooms = action.payload;
                state.loading = false;
                state.fetched = true;
            })
            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createChatRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createChatRoom.fulfilled, (state, action) => {
                state.chatRooms.push(action.payload);
                state.loading = false;
            })
            .addCase(createChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(findChatRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(findChatRoom.fulfilled, (state, action) => {
                state.chatRooms.push(action.payload);
                state.loading = false;
            })
            .addCase(findChatRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clear } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;