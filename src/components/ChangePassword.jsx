import React from "react";
import { useState } from "react";
import { Input, Button } from "./Index.js";
import ideaStore from "../store/store.js";
import { authService } from "../services/Authservice.js";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";

function ChangePassword({ setChangePassword }) {
  const { user } = ideaStore();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
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
      setIsLoading(false);
      setChangePassword(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8 relative">
        <CircleX
          className="w-5 h-5 absolute top-4 right-4 cursor-pointer text-black hover:text-gray-700"
          onClick={() => setChangePassword(false)}
        />
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Update Email</h2>
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
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Your New Password"
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
              "Update password"
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setUpdate(false)}
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
