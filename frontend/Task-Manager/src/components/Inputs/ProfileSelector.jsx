import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

function ProfileSelector({ image, setImage }) {
  const inputRef = useRef(null); // Reference to the hidden file input
  const [previewUrl, setPreviewUrl] = useState(null); // Local state for image preview URL

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save file in parent state
      const preview = URL.createObjectURL(file); // Create preview URL
      setPreviewUrl(preview);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  // Trigger hidden file input when clicking the button
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6 ">
      {/* Hidden file input */}
      <input
        type="file"
        accept="images/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* If no image is selected, show default avatar with upload button */}
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer animate-pulse"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        // If image is selected, show preview with remove button
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileSelector;
