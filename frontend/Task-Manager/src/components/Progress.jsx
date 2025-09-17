import React from "react";

function Progress({ progress, status }) {
  const getColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-[#8D51FF] bg-[#8D51FF] border border-[#8D51FF]/10";
      case "In Progress":
        return "text-[#00B8DB] bg-[#00B8DB] border border-[#00B8DB]/10";
      case "Completed":
        return "text-[#7BCE00] bg-[#7BCE00] border border-[#7BCE00]/10";
      default:
        return "text-[#8D51FF] bg-[#8D51FF] border border-[#8D51FF]/10";
    }
  };
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`${getColor(
          status
        )} h-1.5 rounded-full text-center text-xs font-medium`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default Progress;
