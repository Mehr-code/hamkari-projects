import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">خوش آمدید</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          لطفا اطلاعات مورد نیاز را برای وارد شدن پر کنید
        </p>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            value={email}
            onChange={(target) => setEmail(target.value)}
            label="آدرس ایمیل"
            placeholder="ariya@gmail.com"
          />
          <Input
            type="password"
            value={password}
            onChange={(target) => setPassword(target.value)}
            label="رمز ورود"
            placeholder="حداقل ۸ کارکتر"
          />{" "}
          <Input
            type="text"
            value={email}
            onChange={(target) => setEmail(target.value)}
            label="آدرس ایمیل"
            placeholder="ariya@gmail.com"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            وارد شدن
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            حساب کاربری ندارید؟{" "}
            <Link className="font-medium text-primary"></Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
