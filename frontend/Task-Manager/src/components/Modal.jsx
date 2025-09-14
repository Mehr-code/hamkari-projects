import React from "react";
import { LuX } from "react-icons/lu";

function Modal({ children, isOpen, onClose, title }) {
  // If the modal is not open, render nothing
  if (!isOpen) return;

  return (
    // Overlay background covering the entire screen
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
      {/* Modal wrapper with padding and max width/height */}
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal container with white background, rounded corners, and shadow */}
        <div className="relative bg-white rounded-lg shadow-sm ">
          {/* Modal header: title on the left, close button on the right */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-400">
            {/* Modal title */}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>

            {/* Close button with hover and subtle lift animation */}
            <button
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-red-500 rounded-lg text-3xl w-8 h-8 inline-flex justify-center items-center ease-out transform transition-transform duration-200 hover:-translate-y-0.5"
              type="button"
              onClick={onClose}
            >
              <LuX />
            </button>
          </div>

          {/* Modal content area: renders children components */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
