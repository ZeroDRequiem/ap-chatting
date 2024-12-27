'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchMessages, sendMessage, clearMessages } from '@/store/messageSlice';

type User = {
  id: string;
  username: string;
};

const ChatroomPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const chatPanelRef = useRef<HTMLDivElement>(null);

  const { messages, loading, error, fetched } = useSelector((state: RootState) => state.messages);

  const [chatroomName, setChatroomName] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages and set chatroom name when the page loads
  useEffect(() => {
    if (id) {
      setChatroomName(`Chatroom ${id}`);

      if (!fetched) {
        // Fetch chatroom messages
        dispatch(fetchMessages(id));
      }
    }

    // Mock users for now
    setUsers([
      { id: '1', username: 'Alice' },
      { id: '2', username: 'Bob' },
    ]);
  }, [id, dispatch, fetched]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(
        sendMessage({
          chatroomId: id!,
          message: {
            username: 'You',
            text: newMessage,
            chatroomId: id!,
          },
        })
      );
      setNewMessage('');
    }
  };

  // Handle leaving the chatroom
  const handleLeaveChatroom = () => {
    dispatch(clearMessages());
    router.push('/home');
  };

  if (!id) {
    return <p>Invalid chatroom ID!</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">{chatroomName}</h1>
        <button
          onClick={handleLeaveChatroom}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Leave Chatroom
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Chat Panel */}
        <div
          ref={chatPanelRef}
          className="flex-grow p-4 bg-white border-r overflow-y-auto"
        >
          <h2 className="text-lg font-semibold mb-4">Chat</h2>
          {loading && !fetched && <p>Loading messages...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.id} className="p-2 border rounded-md">
                <span className="font-bold">{message.username}: </span>
                <span>{message.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Panel */}
        <div className="w-64 p-4 bg-gray-50 border-l overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="p-2 bg-white border rounded-md">
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Input Panel */}
      <footer className="p-4 bg-gray-200 border-t">
        <div className="flex items-center gap-2">
          <textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatroomPage;
