import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("لطفا یک آدرس ایمیل معتبر وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    if (!password) {
      setError("لطفا رمز عبور خود را وارد کنید.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    // Calling Login API
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
          />{" "}
          {error && (
            <p className="text-red-600 font-semibold text-sm pb-2.5 animate-shake">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary">
            وارد شدن
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            حساب کاربری ندارید؟{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              عضو شدن
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
