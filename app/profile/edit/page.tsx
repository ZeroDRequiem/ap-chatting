'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { findUser, updateUser } from '@/store/userSlice';
import { toast } from 'react-toastify';

const ProfileEditPage = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) {
    router.push('/login');
  }

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [jobTitle, setJobTitle] = useState(user?.jobTitle);
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const [screenName, setScreenName] = useState<string | null>(user?.screenName || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {

    try{
      const result = await dispatch(updateUser({ firstName, lastName, jobTitle, profilePicture, screenName })).unwrap();
      toast.success('Profile updated successfully!');

    }
    catch(err){
      toast.error('Profile update failed!');
    }

  };

  const handleCancel = () => {
    router.back(); 
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 mb-2">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Screen Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Screen Name (Optional)</label>
            <input
              type="text"
              value={screenName || ''}
              onChange={(e) => setScreenName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
