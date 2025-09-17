import React from "react";
import { toPersianDigits } from "../utils/helper";

// Component to display a group of avatars with a max visible count
// Shows a tooltip with the name when hovering over each avatar
function AvatarGroup({ avatars, maxVisible = 3 }) {
  return (
    <div className="flex items-center">
      {/* Render visible avatars */}
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div key={`Avatar ${index}`} className="relative group">
          <img
            src={avatar.src} // avatar image source
            alt={avatar.name} // accessibility text
            className="w-9 h-9 rounded-full border-2 border-white -mr-3 first:mr-0 cursor-pointer"
          />
          {/* Tooltip */}
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {avatar.name}
          </div>
        </div>
      ))}

      {/* Counter for extra avatars */}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-primary text-white text-base font-medium rounded-full -mr-3">
          {toPersianDigits(avatars.length - maxVisible)}+
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;
