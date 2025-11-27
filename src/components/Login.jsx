import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Authservice.js";
import { Button } from "./Index.js";
import Input from "./Input.jsx";
import ideaStore from "../store/store.js";

export default function Login() {
  const { setLoggedIn, fetchUser } = ideaStore.getState();
  const navigate = useNavigate();
  const [errmsg, setErrmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await authService.login(
      formData.email,
      formData.password
    );

    if (error) {
      setErrmsg(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setLoggedIn(true);
      await fetchUser(data.user);
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to your account</p>
          {errmsg && (
            <p className="text-sm text-red-700 m-2 p-2 rounded-lg bg-red-100 font-bold">
              {errmsg}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <div
            className="text-right mb-4 cursor-pointer text-[#2DD4BF] hover:text-[#24a493] transition"
            onClick={() => navigate("/auth/send-pass-request")}
          >
            Forget Password?
          </div>

          <Button type="submit" className="w-full">
            {loading ? (
              <l-tailspin
                size="20"
                stroke="3"
                speed="0.9"
                color="white"
              ></l-tailspin>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/auth/register")}
              className="text-[#2DD4BF] font-medium hover:text-[#24a493] transition cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
