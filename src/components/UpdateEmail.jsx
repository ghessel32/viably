import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "./Index.js";
import ideaStore from "../store/store";
import { authService } from "../services/Authservice.js";
import { CircleX } from "lucide-react";

const UpdateEmail = ({ setUpdate }) => {
  const { user } = ideaStore();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (formData.email === user?.email) {
        setErrorMessage("No changes detected.");
        setIsLoading(false);
        return;
      }

      const { user: updatedUser, error } = await authService.updateEmail(
        formData.email
      );

      if (error) {
        setErrorMessage(error.message || "Failed to update email.");
        setIsLoading(false);
        return;
      }

      // Show success message with instructions
      setSuccessMessage(
        `Confirmation emails sent to both ${formData.email} and ${user?.email}. Please check both inboxes and click the confirmation links.`
      );

      // Don't update local store yet - wait for confirmation
      // The email will only change after both confirmations
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8 relative">
        <CircleX
          className="w-5 h-5 absolute top-4 right-4 cursor-pointer text-black hover:text-gray-700"
          onClick={() => setUpdate(false)}
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
            label="New Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your New Email"
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
              "Update Email"
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
};

export default UpdateEmail;
