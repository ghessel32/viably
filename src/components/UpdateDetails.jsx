import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Index.js";
import Input from "./Input.jsx";
import ideaStore from "../store/store";
import { authService } from "../services/Authservice.js";
import { CircleX } from "lucide-react";

const UpdateDetails = ({ setUpdate }) => {
  const { user } = ideaStore();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    profession: user?.profession || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const updates = {};

      if (formData.username !== user?.username) {
        updates.username = formData.username;
      }

      if (formData.profession !== user?.profession) {
        updates.profession = formData.profession;
      }

      // If no changes → don't call API
      if (Object.keys(updates).length === 0) {
        setErrorMessage("No changes detected.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await authService.updateUser(
        user.user_id,
        updates
      );

      if (error) {
        setErrorMessage("Failed to update details.");
        setIsLoading(false);
        return;
      }

      ideaStore.setState({
        user: {
          ...user,
          ...updates,
        },
      });
      setUpdate(false);
    } catch (err) {
      setErrorMessage("Something went wrong.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50  overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8 relative">
        <CircleX
          className="w-5 h-5 absolute top-4 right-4 cursor-pointer text-black hover:text-gray-700"
          onClick={() => setUpdate(false)}
        />
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
              "update details"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDetails;
