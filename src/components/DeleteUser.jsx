import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Index.js";
import ideaStore from "../store/store";
import { authService } from "../services/Authservice.js";
import { CircleX, Delete } from "lucide-react";

const DeleteUser = ({ setDeleteCard }) => {
  const { user } = ideaStore();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    const { data, error } = await authService.deleteUser(user.user_id);
    if (error) {
      setErrorMessage("Failed to delete account. Please try again.");
      setIsLoading(false);
      return;
    }
    setSuccessMessage("Account deleted successfully.");
    setIsLoading(false);
    navigate("/auth/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8 relative">
        <CircleX
          className="w-5 h-5 absolute top-4 right-4 cursor-pointer text-black hover:text-gray-700"
          onClick={() => setDeleteCard(false)}
        />
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Delete Account</h2>
          <p className="text-gray-600 mt-2">
            Deleting your account is irreversible. All your data will be lost.
          </p>
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

        <div className="space-y-4">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-red-700 hover:text-red-600 hover:border-red-600 active:bg-red-600 active:text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <l-tailspin
                size="20"
                stroke="3"
                speed="0.9"
                color="white"
              ></l-tailspin>
            ) : (
              "Delete My Account"
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setDeleteCard(false)}
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
