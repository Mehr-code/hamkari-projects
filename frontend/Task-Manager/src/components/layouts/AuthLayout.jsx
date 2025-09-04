import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
      <h2 className="text-lg font-medium text-black">مدیریت وظایف پروژه ها</h2>
      {children}
    </div>
  );
}

export default AuthLayout;
