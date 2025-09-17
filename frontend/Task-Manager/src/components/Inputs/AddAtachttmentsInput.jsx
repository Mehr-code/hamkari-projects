import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import Swal from "sweetalert2";

function AddAttachmentsInput({ attachments, setAttachment }) {
  const [options, setOptions] = useState("");

  const handleAddOption = () => {
    if (options.trim()) {
      setAttachment([...attachments, options.trim()]);
      setOptions("");
    } else {
      // Show error if input is empty
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "لطفا لینک فایل ضمیمه خود را ابتدا وارد کنید.",
        showConfirmButton: true,
        confirmButtonText: "باشه",
        confirmButtonColor: "#1368EC",
      });
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachment(updatedArr);
  };

  const formatLink = (link) => {
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "https://" + link;
    }
    return link;
  };

  return (
    <div>
      {/* Show message if the attachment list is empty */}
      {attachments.length === 0 ? (
        <p className="text-red-500 text-sm"> هیچ ضمیمه ای وجود ندارد. </p>
      ) : (
        attachments.map((item, index) => (
          <div
            key={"attach" + index}
            className="flex justify-between bg-gray-100 border border-x-gray-200 px-3 py-2 rounded-md mb-3 mt-2"
          >
            <div className="flex-1 flex items-center gap-3">
              <LuPaperclip className="text-blue-500" />
              <a
                className="text-gray-400 hover:text-blue-500 cursor-pointer truncate text-sm"
                target="_blank"
                rel="noopener noreferrer"
                href={formatLink(item)}
              >
                {item}
              </a>
            </div>
            <button
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        ))
      )}
      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-md ">
          <input
            type="text"
            placeholder="لینک فایل ضمیمه را وارد کنید..."
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            className="w-full text-[13px] text-black outline-none px-3 bg-white py-2  focus:border-blue-400 focus:ring-1 focus:ring-blue-300 rounded-md"
            onKeyDown={(e) => {
              // Press Enter to add item
              if (e.key === "Enter") handleAddOption();
            }}
          />
        </div>
        <button className="card-btn" onClick={handleAddOption}>
          اضافه کردن
          <HiMiniPlus className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default AddAttachmentsInput;
