import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Authservice.js";
import { Button } from "./Index.js";
import Input from "./Input.jsx";


export default function Register() {
  const navigate = useNavigate();
  const [confMessage, setConfMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errmsg, setErrmsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await authService.register(
      formData.email,
      formData.password
    );
    if (error) {
      console.log(error);
      setErrmsg(error.message);
      return;
    }
    if (data.user) {
      setConfMessage(true);
      setIsLoading(false);
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Sign up to get started</p>
          {confMessage && (
            <p className="text-sm text-green-700 m-2 p-2 rounded-lg bg-green-300 font-bold">
              Check email inbox for confirmation.
            </p>
          )}
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

          <Button type="submit" className="w-full">
            {isLoading ? (
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
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-[#2DD4BF] font-medium hover:text-[#299f90] transition cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
