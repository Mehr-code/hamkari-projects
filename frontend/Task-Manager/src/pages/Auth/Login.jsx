import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout"; // Layout wrapper for auth pages
import Input from "../../components/Inputs/Input"; // Custom input component
import { Link, useNavigate } from "react-router-dom"; // For routing and navigation
import { validateEmail } from "../../utils/helper"; // Helper function to validate email
import axiosInstance from "../../utils/axiosInstance"; // Axios instance with default config
import { API_PATHS } from "../../utils/apiPaths"; // API endpoint paths
import { UserContext } from "../../context/userContext"; // User context to manage auth state

const Login = () => {
  // Local state for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Get updateUser function from UserContext to save logged-in user
  const { updateUser } = useContext(UserContext);

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation for email
    if (!validateEmail(email)) {
      setError("لطفا یک آدرس ایمیل معتبر وارد کنید.");
      setTimeout(() => setError(""), 4000);
      return;
    }

    // Check if password is entered
    if (!password) {
      setError("لطفا رمز عبور خود را وارد کنید.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    // Call login API
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      // Destructure token, role, and other user data from API response
      const { token, role, ...rest } = response.data;

      if (token) {
        // Combine token and user data
        const userData = { token, role, ...rest };

        // Update context and localStorage with logged-in user
        updateUser(userData);

        // Redirect user based on their role
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/user/dashboard");
      }
    } catch (err) {
      // Handle API errors
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("خطایی رخ داد. لطفا دوباره تلاش کنید.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">خوش آمدید</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          لطفا اطلاعات مورد نیاز را برای وارد شدن پر کنید
        </p>
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="آدرس ایمیل"
            placeholder="ariya@gmail.com"
          />

          {/* Password input */}
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="رمز ورود"
            placeholder="حداقل ۸ کارکتر"
          />

          {/* Display error message */}
          {error && (
            <p className="text-red-600 font-semibold text-sm pb-2.5 animate-shake">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button type="submit" className="btn-primary">
            وارد شدن
          </button>

          {/* Link to signup page */}
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
