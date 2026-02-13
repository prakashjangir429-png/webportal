import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../axiosInstance";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1); // 1: Verification, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    clientId: "",
    email: "",
    mobileNumber: ""
  });
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [verificationToken, setVerificationToken] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user-meta/verify", formData);
      
      if (response.data.status === "Success") {
        setVerificationToken(response.data.verificationToken);
        setStep(2);
        setSuccess("Verification successful. You can now reset your password.");
      } else {
        setError(response.data.message || "Verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (resetData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/user-meta/reset", {
        verificationToken,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      });

      if (response.data.status === "Success") {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setError(response.data.message || "Password reset failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {step === 1 ? "Reset Your Password" : "Create New Password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step === 1 
                ? "Please provide your account details to verify your identity" 
                : "Enter your new password below"
              }
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-100">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleVerification}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">
                    Full Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userName">
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="Enter your username"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="clientId">
                    Client ID <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="clientId"
                    name="clientId"
                    placeholder="Enter your Client ID"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mobileNumber">
                    Mobile Number <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    isLoading={loading}
                  >
                    {loading ? "Verifying..." : "Verify Account"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">
                    New Password <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password (min 8 characters)"
                    value={resetData.newPassword}
                    onChange={handleResetInputChange}
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={resetData.confirmPassword}
                    onChange={handleResetInputChange}
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                    isLoading={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}