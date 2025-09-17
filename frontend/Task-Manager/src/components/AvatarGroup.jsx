import React from "react";
import { toPersianDigits } from "../utils/helper";

/**
 * AvatarGroup Component
 *
 * Props:
 * - avatars: Array<[src, name]> | []   → list of avatars (array of tuples)
 * - maxVisible: number                 → how many avatars should be visible
 *
 * Behavior:
 * - Shows avatars in reverse row (right to left)
 * - If there are more avatars than `maxVisible`, shows a "+N" indicator
 */
function AvatarGroup({ avatars = [], maxVisible = 3 }) {
  // Ensure avatars is always an array (avoid runtime errors)
  const safeAvatars = Array.isArray(avatars) ? avatars : [];

  // Slice only the visible avatars based on maxVisible
  const visible = safeAvatars.slice(0, maxVisible);

  // Calculate the remaining avatars count (for "+N")
  const extraCount = Math.max(0, safeAvatars.length - maxVisible);

  return (
    <div className="flex items-center flex-row-reverse">
      {/* Render visible avatars */}
      {visible.map((item, index) => {
        // Each avatar item is expected as [src, name]
        const src = item[0] || "";
        const name = item[1] || `Avatar ${index + 1}`;

        return (
          <div
            key={src || index}
            className="relative group -mr-3 last:-mr-0"
            style={{ zIndex: visible.length - index }} // Stack order (first on top)
          >
            {/* Avatar image */}
            <img
              src={src}
              alt={name || `Avatar ${index + 1}`}
              loading="lazy"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            />

            {/* Tooltip on hover (shows the name) */}
            {name && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {name}
              </div>
            )}
          </div>
        );
      })}

      {/* Show "+N" if there are extra avatars beyond maxVisible */}
      {extraCount > 0 && (
        <div className="mr-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-base border border-white">
          {toPersianDigits(extraCount)}+
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;
