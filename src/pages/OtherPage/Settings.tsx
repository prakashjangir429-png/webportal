import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UserContext";
import api from "../../axiosInstance";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Card from "../../components/common/ComponentCard";

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form hooks
  const {
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const watchNewPassword = watch("newPassword");
  const watchConfirmPassword = watch("confirmPassword");

  // Handle password change
  const onPasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setFormErrors({ confirmPassword: "New passwords don't match" });
      return;
    }
    try {
      setLoading(true);
      setFormErrors({});
      
      await api.put("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.confirmPassword
      });
      
      toast.success("Password changed successfully");
      resetPasswordForm();
      setFormErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <PageMeta
        title="Settings | Your App Name"
        description="Manage your account settings"
      />
      <PageBreadcrumb pageTitle="Settings" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                Settings
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${activeTab === "profile"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${activeTab === "password"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Change Password
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <Label>Username</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200">
                          {user?.userName || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Email</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200">
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Full Name</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200">
                          {user?.fullName || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Mobile Number</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200">
                          {user?.mobileNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Account Role</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-800 dark:text-gray-200 capitalize">
                          {user?.role?.toLowerCase() || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Account Status</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                          {user?.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Account Created</Label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-800 dark:text-gray-200">
                        {formatDate(user?.createdAt) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Password Change Section */}
            {activeTab === "password" && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Change Password
                  </h2>

                  <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="max-w-lg">
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          placeholder="Enter your current password"
                          onChange={(e) => setValue("currentPassword", e.target.value)}
                          error={formErrors.currentPassword}
                          className="w-full"
                        />
                        {formErrors.currentPassword && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          placeholder="Enter your new password"
                          onChange={(e) => setValue("newPassword", e.target.value)}
                          error={formErrors.newPassword}
                          className="w-full"
                        />
                        {formErrors.newPassword && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.newPassword}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Re-enter your new password"
                          onChange={(e) => setValue("confirmPassword", e.target.value)}
                          error={formErrors.confirmPassword || (watchNewPassword && watchConfirmPassword && watchNewPassword !== watchConfirmPassword)}
                          className="w-full"
                        />
                        {(formErrors.confirmPassword || (watchNewPassword && watchConfirmPassword && watchNewPassword !== watchConfirmPassword)) && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.confirmPassword || "Passwords don't match"}
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          loading={loading}
                          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;