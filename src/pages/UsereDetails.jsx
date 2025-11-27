import React, { useState } from "react";
import { Button, Input } from "../components/Index.js";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Authservice.js";
import ideaStore from "../store/store.js";

function UsereDetails() {
  const { fetchUser } = ideaStore.getState();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    profession: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data: sessionData, error: sessionError } =
        await authService.getSession();

      if (sessionError || !sessionData?.session) {
        setErrorMessage(sessionError?.message || "No active session found");
        setIsLoading(false);
        return;
      }

      const { error: insertError } = await authService.setUser(
        sessionData.session.user.id,
        formData.username,
        formData.profession
      );

      if (insertError) {
        setErrorMessage(insertError.message);
        return;
      }

      await fetchUser(sessionData.session.user);
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
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
    <div className="min-h-screen flex items-center justify-center p-4 m-10">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 
                absolute top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 z-99"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">User Details</h2>
          {errorMessage && (
            <p className="text-sm text-red-700 m-2 p-2 rounded-lg bg-red-100 font-bold">
              {errorMessage}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Your Name"
            required
          />

          <Input
            label="Profession "
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Enter your profession "
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
              "save details"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UsereDetails;
