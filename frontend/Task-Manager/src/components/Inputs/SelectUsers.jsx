import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import { toPersianDigits } from "../../utils/helper";

function SelectUsers({ selectedUsers, setSelectedUsers }) {
  // State for storing all users fetched from the API
  const [allUsers, setAllUsers] = useState([]);

  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Temporary state for selected users inside modal before confirming
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Loading state while fetching users
  const [loading, setLoading] = useState(false);

  // Function to fetch all users from API
  const getAllUsers = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data); // Save users to state
      }
    } catch (err) {
      console.error("خطا هنگام دریافت اطلاعات کاربران", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Toggle a user's selection in temporary state
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // Remove if already selected
          : [...prev, userId] // Add if not selected
    );
  };

  // Assign selected users permanently and close modal
  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Map selected users to their avatar URLs
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  // Fetch all users when component mounts
  useEffect(() => {
    getAllUsers();
  }, []);

  // Sync temporary selection with main selection when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [isModalOpen, selectedUsers]);

  return (
    <div className="space-y-3 mt-2">
      {/* If no users selected, show add button */}
      {selectedUserAvatars.length === 0 ? (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          اضافه کردن کاربر
          <LuUsers className="text-sm" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {/* Display selected user avatars with a maximum of 3 */}
          <div className="flex flex-row-reverse">
            {selectedUserAvatars.slice(0, 3).map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt="user"
                className={`w-9 h-9 rounded-full border-[2px] border-white ${
                  i !== 0 ? "-mr-2" : "-mr-2"
                }`}
              />
            ))}
            {/* If more than 3 users selected, show counter */}
            {selectedUserAvatars.length > 3 && (
              <div className="-mr-2 w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 border border-white">
                {toPersianDigits(selectedUserAvatars.length - 3)}+
              </div>
            )}
          </div>
          {/* Button to open modal and change users */}
          <button
            className="card-btn text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            تغییر کاربران
          </button>
        </div>
      )}

      {/* Modal for selecting users */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="اضافه کردن کاربر"
      >
        {/* Modal content: either loading or list of users */}
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">
              در حال دریافت اطلاعات...
            </p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-300"
              >
                {/* User avatar */}
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                {/* User information */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-[14px] text-gray-500">{user.email}</p>
                </div>
                {/* Checkbox to select/deselect user */}
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            ))
          )}
        </div>

        {/* Button to confirm selected users */}
        <div className="flex justify-center pt-4">
          <button className="card-btn-fill" onClick={handleAssign}>
            ثبت کاربران
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SelectUsers;
