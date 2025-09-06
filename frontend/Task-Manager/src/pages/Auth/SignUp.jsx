import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfileSelector from "../../components/Inputs/ProfileSelector";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
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
    if (!adminInviteToken) {
      setError("لطقا توکن دعوت مدیر را وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Calling Login API
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black ">ایجاد حساب کاربری</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          لطفا اطلاعات مورد نیاز را برای عضو شدن پر کنید
        </p>

        <form onSubmit={handleSignUp}>
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
