"use client";

import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfileSelector from "../../components/Inputs/ProfileSelector";
import Input from "../../components/Inputs/Input";
import { Link, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadImage";
import Swal from "sweetalert2";

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    let profileImageUrl = "";
    if (profile) {
      const imgUploadRes = await uploadImage(profile);
      profileImageUrl = imgUploadRes.imageUrl || "";
    }
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name: fullName,
      email,
      password,
      profileImageUrl,
      adminInviteToken: adminInviteToken || "",
    });
    const { token, role } = response.data;
    if (token) {
      localStorage.setItem("Mehr_token", token);
      updateUser(response.data);
      role === "admin"
        ? navigate("/admin/dashboard")
        : navigate("/user/dashboard");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!fullName) {
      setError("لطفا نام و نام خوانوادگی خود را وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    if (!validateEmail(email)) {
      setError("لطفا یک آدرس ایمیل معتبر وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    if (!password) {
      setError("لطفا رمز عبور خود را وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Check token
    if (!adminInviteToken) {
      Swal.fire({
        title: "توکن دعوت مدیر وارد نشده است",
        text: "در صورت نداشتن توکن، می‌توانید فرآیند ثبت‌نام را بدون آن ادامه دهید یا عملیات را لغو نمایید.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ادامه بدون توکن",
        cancelButtonText: "لغو",
        confirmButtonColor: "#1368ec", // رنگ اصلی پروژه (primary-color)
        cancelButtonColor: "#64748b", // خاکستری متناسب با bg-slate-200
        background: "#fcfbfc", // هم‌رنگ پس‌زمینه پروژه
        color: "#1e293b", // رنگ متن (text-slate-800 / نزدیک مشکی)
      })
        .then((result) => {
          if (result.isConfirmed) {
            handleSignUp();
          }
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await handleSignUp();
            } catch (err) {
              setError(
                err.response?.data?.message ||
                  "خطایی رخ داد. لطفا دوباره تلاش کنید."
              );
            }
          }
        });
      return;
    }

    // Submit directly
    try {
      await handleSignUp();
    } catch (err) {
      setError(
        err.response?.data?.message || "خطایی رخ داد. لطفا دوباره تلاش کنید."
      );
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black ">ایجاد حساب کاربری</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          لطفا اطلاعات مورد نیاز را برای عضو شدن پر کنید
        </p>

        <form onSubmit={handleSubmit}>
          <ProfileSelector image={profile} setImage={setProfile} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="نام و نام خوانوادگی"
              placeholder="کیمیا پارسا"
              type="text"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="آدرس ایمیل"
              placeholder="ariya@gmail.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="رمز ورود"
              placeholder="حداقل ۸ کارکتر"
            />
            <Input
              type="text"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              label="توکن دعوت مدیر"
              placeholder="عدد 6 رقمی"
            />
          </div>
          {error && (
            <p className="text-red-600 font-semibold text-sm pb-2.5 animate-shake">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary">
            عضو شدن
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            حساب کاربری دارید؟{" "}
            <Link className="font-medium text-primary underline" to="/login">
              وارد شدن
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
