'use client';

import { useState, useRef, useEffect } from 'react';
import ChatRoomItem from '@/components/ChatRoomItem';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ChatRoom } from '@/types/Chatroom'
import { fetchChatRooms, clear, createChatRoom, findChatRoom } from '@/store/chatRoomSlice';
import { logout } from '@/store/userSlice';

const HomePage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { chatRooms, loading, error, fetched } = useSelector((state: RootState) => state.chatRooms);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {

    if(!fetched){
      dispatch(fetchChatRooms());
    }
  }, [dispatch, fetched]);

  const [newRoom, setNewRoom] = useState('');
  const [externalRoom, setExternalRoom] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateRoom = async () => {
    try{
      await dispatch(createChatRoom(newRoom));
      toast.success('Chatroom created successfully!');
      setNewRoom('');
    }
    catch(err){
      toast.error('Chatroom already exists or name is invalid!');
    }
  };

  const handleJoinExternalRoom = async () => {
    try{
      await dispatch(findChatRoom(externalRoom));
      toast.success('External chatroom joined successfully!');
      setExternalRoom('');
    }
    catch(err){
      toast.error('Chatroom does not exists or name is invalid!');
    }
  };

  const handleLogout = async () => {
    
    await dispatch(logout());
    window.location.href = '/login'; // Redirect to login page
  };

  const handleOnJoin = (id: string) => {
    router.push(`/chatroom/${id}`); // Navigate to the chatroom/[id] page
  };

  const handleOnLeave = (id: string) => {
    toast.warn(`Leaving chatroom with ID: ${id}`);
  };

  const handleProfileEdit = () => {
    router.push('/profile/edit'); // Navigate to the profile/edit page
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome to the Chat System</h1>

        {/* User Icon and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 p-2 bg-white rounded-full shadow-md focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={user?.profilePicture || "https://via.placeholder.com/40"}
              alt="User Icon"
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden md:block font-medium">Profile</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
              <button
                onClick={handleProfileEdit}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create and Join Chatrooms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Create New Chatroom */}
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Create a New Chatroom</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New chatroom name"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleCreateRoom}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-1"
            >
              + Create
            </button>
          </div>
        </div>

        {/* Join External Chatroom */}
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Join an External Chatroom</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="External chatroom name"
              value={externalRoom}
              onChange={(e) => setExternalRoom(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleJoinExternalRoom}
              className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center gap-1"
            >
              🔗 Join
            </button>
          </div>
        </div>
      </div>

      {/* All Chatrooms Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Chatrooms</h2>
        <ul className="space-y-4">
          {chatRooms.map((room) => (
            <ChatRoomItem
              key={room.id}
              room={room}
              onJoin={handleOnJoin} // Updated: Navigate to chatroom/[id]
              onLeave={handleOnLeave}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
