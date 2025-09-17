import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function Input({ value, onChange, label, placeholder, type }) {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle between showing and hiding the password
  };

  return (
    <div>
      {/* Input label */}
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        {/* Input field */}
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type // Show/hide password logic
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)} // Pass event to parent onChange
        />

        {/* Show password toggle only if input type is password */}
        {type === "password" && (
          <>
            {showPassword ? (
              // If password is visible, show "eye" icon
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              // If password is hidden, show "eye slash" icon
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Input;
