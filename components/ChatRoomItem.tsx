'use client';

import React from 'react';

type ChatRoom = {
  id: string;
  name: string;
};

type ChatRoomItemProps = {
  room: ChatRoom;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
};

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ room, onJoin, onLeave }) => {
  return (
    <li className="flex justify-between items-center p-4 bg-white border rounded-md shadow-md hover:shadow-lg transition-shadow">
      {/* Chatroom Name */}
      <div>
        <span className="font-medium">{room.name}</span>
      </div>

      {/* Join and Leave Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onJoin(room.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Join
        </button>
        <button
          onClick={() => onLeave(room.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Leave
        </button>
      </div>
    </li>
  );
};

export default ChatRoomItem;
