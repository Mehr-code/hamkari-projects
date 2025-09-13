import React from "react";

function InfoCard({ label, value, color }) {
  return (
    <div className="flex items-center gap-3 ">
      <div className={`w-2 md:w-2 h-3  md:h-5 ${color} rounded-md`}></div>

      <p className="text-xs md:text-sm text-gray-700 text-right">
        {label}
        {": "}
        <span className="font-semibold text-sm md:text-[16px] text-black">
          {value}
        </span>
      </p>
    </div>
  );
}

export default InfoCard;
