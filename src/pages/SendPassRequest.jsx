import React, { useState } from "react";
import { authService } from "../services/Authservice.js";
import { Button, Input } from "../components/Index.js";
import { CircleX } from "lucide-react";
function SendPassRequest() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const { user: updatedUser, error } =
        await authService.sendPasswordResetEmail(formData.email);

      if (error) {
        setErrorMessage(error.message || "Failed to update email.");
        setIsLoading(false);
        return;
      }

      // Show success message with instructions
      setSuccessMessage(
        `A password reset link has been sent to ${formData.email}. Please check your inbox and follow the instructions to reset your password.`
      );
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    }

    setIsLoading(false);
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
          <h2 className="text-3xl font-bold text-gray-800">
            Send Password Reset Link
          </h2>
          {errorMessage && (
            <p className="text-sm text-red-700 m-2 p-2 rounded-lg bg-red-100 font-bold">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-green-700 m-2 p-2 rounded-lg bg-green-100 font-bold">
              {successMessage}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <l-tailspin
                size="20"
                stroke="3"
                speed="0.9"
                color="white"
              ></l-tailspin>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SendPassRequest;
