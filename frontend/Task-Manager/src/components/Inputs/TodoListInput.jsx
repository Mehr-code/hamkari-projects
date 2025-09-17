import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import Swal from "sweetalert2";
import { toPersianDigits } from "../../utils/helper";

function TodoListInput({ todoList, setTodoList }) {
  // Local state for the current input value
  const [option, setOption] = useState("");

  // Add new item to the todoList
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption(""); // reset input after adding
    } else {
      // Show error if input is empty
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "لطفا ریز وظیفه خود را ابتدا وارد کنید.",
        showConfirmButton: true,
        confirmButtonText: "باشه",
        confirmButtonColor: "#1368EC",
      });
    }
  };

  // Delete an item by index
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="">
      {/* Show message if the todo list is empty */}
      {todoList.length === 0 ? (
        <p className="text-red-500 text-sm">هیچ ریز وظیفه ای وجود ندارد.</p>
      ) : (
        // Render todo list items
        todoList.map((item, index) => (
          <div
            key={"List" + index}
            className="flex justify-between bg-gray-100 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
          >
            <p className="text-sm text-black">
              {/* Show index number (converted to Persian digits) */}
              <span className="text-xs text-primary font-semibold ml-2">
                {toPersianDigits(index + 1)}
              </span>
              {item}
            </p>

            {/* Delete button */}
            <button
              className="cursor-pointer"
              onClick={() => {
                handleDeleteOption(index);
              }}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        ))
      )}

      {/* Input for adding new todo item */}
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="ریز وظیفه خود را وارد کنید..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-slate-300 px-3 py-2 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          onKeyDown={(e) => {
            // Press Enter to add item
            if (e.key === "Enter") handleAddOption();
          }}
        />
        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          اضافه کردن <HiMiniPlus className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default TodoListInput;
