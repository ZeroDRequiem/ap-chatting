import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMessagesFromApi, sendMessageToApi } from '@/services/messages.api';

type Message = {
  id: string;
  username: string;
  text: string;
  chatroomId: string;
};

type MessageState = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
};

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
  fetched: false,
};

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (chatroomId: string, { rejectWithValue }) => {
    try {
      const messages = await fetchMessagesFromApi(chatroomId);
      return messages;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch messages');
    }
  }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    { chatroomId, message }: { chatroomId: string; message: Omit<Message, 'id'> },
    { rejectWithValue }
  ) => {
    try {
      const newMessage = await sendMessageToApi(chatroomId, message);
      return newMessage;
    } catch (error: any) {
      return rejectWithValue('Failed to send message');
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = []; // Clear all messages
      state.fetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
        state.fetched = true;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        state.messages.push(action.payload); // Add the new message
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
