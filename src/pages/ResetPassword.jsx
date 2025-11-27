import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Authservice.js";
import { Button, Input } from "../components/Index.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [errmsg, setErrmsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrmsg("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const { data, error } = await authService.updatePassword(
        formData.password
      );
      if (error) {
        setErrorMessage(error.message || "Failed to update password");
      } else {
        setSuccessMessage("Password updated successfully");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
      navigate("/auth/login");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 m-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your new password</p>
          {errmsg && (
            <p className="text-sm text-red-700 m-2 p-2 rounded-lg bg-red-100 font-bold">
              {errmsg}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? (
              <l-tailspin
                size="20"
                stroke="3"
                speed="0.9"
                color="white"
              ></l-tailspin>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
