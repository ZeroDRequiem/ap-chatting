import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatRoomsReducer from './chatRoomSlice';
import messageReducer from './messageSlice';

const store = configureStore({
  reducer: {
    user: userReducer, // Add the user slice to the store
    chatRooms: chatRoomsReducer, // Add the chatRooms slice to the store
    messages: messageReducer, // Add the messages slice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
