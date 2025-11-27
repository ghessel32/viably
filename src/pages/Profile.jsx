import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowBigLeft,
  Mail,
  Calendar,
  Briefcase,
  LogOut,
  Trash2,
  Key,
  UserPen,
} from "lucide-react";
import Avatar from "boring-avatars";
import ideaStore from "../store/store";
import UpdateDetails from "../components/UpdateDetails";
import UpdateEmail from "../components/UpdateEmail.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import DeleteUser from "../components/DeleteUser.jsx";
import supabase from "../services/AuthClient.js";
import { authService } from "../services/Authservice.js";

function Profile() {
  const { user, updateUser, totalIdeas } = ideaStore();
  const navigate = useNavigate();
  const [update, setUpdate] = React.useState(false);
  const [updateEmail, setUpdateEmail] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [deleteCard, setDeleteCard] = React.useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "USER_UPDATED" && session?.user) {
          updateUser({ email: session.user.email });
        }

        if (event === "SIGNED_OUT") {
          ideaStore.getState().logout();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [updateUser]);

  const joinedDate = new Date(user?.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleLogOut = async () => {
    await authService.signOut();
    ideaStore.getState().logout();
    navigate("/auth/login");
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 pb-20 overflow-y-hidden">
      {/* Update Details Modal */}
      {update && <UpdateDetails setUpdate={setUpdate} />}
      {updateEmail && <UpdateEmail setUpdate={setUpdateEmail} />}
      {changePassword && (
        <ChangePassword setChangePassword={setChangePassword} />
      )}
      {deleteCard && <DeleteUser setDeleteCard={setDeleteCard} />}

      <div className="underline text-teal-500 ml-2 mb-4 block md:hidden">
        <a onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer">
          <ArrowBigLeft className="w-5 h-5" /> Back
        </a>
      </div>    
     

      {/* Profile Card */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-blue-100">
        <div className="flex items-start gap-6 flex-col md:flex-row">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar name={user?.username || "user"} size={80} variant="beam" />
          </div>

          {/* Info */}
          <div className="flex-1 max-h-80">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.username || "user"}
            </h1>

            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {user?.email || "plrseller@example.com"}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {user?.profession || "Not specified"}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Member since {joinedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Ideas Validated</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {totalIdeas || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Since</p>
          <h2 className="text-lg font-semibold text-gray-900 mt-2">
            {new Date(user?.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }) || "N/A"}
          </h2>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Settings
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          <button
            onClick={() => setUpdate(true)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left group cursor-pointer"
          >
            <UserPen className="w-5 h-5 text-gray-400 group-hover:text-[#2DD4BF] transition-colors" />
            <div>
              <p className="font-medium text-gray-900">Change Details</p>
              <p className="text-sm text-gray-500">Update your display name</p>
            </div>
          </button>

          <button
            onClick={() => setUpdateEmail(true)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left group cursor-pointer"
          >
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#2DD4BF] transition-colors" />
            <div>
              <p className="font-medium text-gray-900">Change Email</p>
              <p className="text-sm text-gray-500">Update your email</p>
            </div>
          </button>

          <button
            onClick={() => setChangePassword(true)}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left group cursor-pointer"
          >
            <Key className="w-5 h-5 text-gray-400 group-hover:text-[#2DD4BF] transition-colors" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">
                Update your security credentials
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>

        <div className="divide-y divide-red-100">
          <button
            onClick={() => setDeleteCard(true)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <span className="text-sm text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Delete →
            </span>
          </button>

          <button
            onClick={handleLogOut}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
              <div>
                <p className="font-medium text-gray-900">Logout</p>
                <p className="text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>
            </div>
            <span className="text-sm text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Logout →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
