import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Wallet,
    User,
    Mail,
    Phone,
    IndianRupee,
    Loader2,
    Shield,
    CreditCard,
    Sparkles,
    PictureInPicture
} from "lucide-react";
import api from "../axiosInstance";

interface TokenResponse {
    status: string;
    token: string;
    message?: string;
}

interface TopUpFormData {
    name: string;
    email: string;
    mobile: string;
    amount: number;
}

const SelfWalletTopUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenLoading, setIsTokenLoading] = useState(false);
    const [bearerToken, setBearerToken] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<TopUpFormData>();

    const watchAmount = watch("amount");

    const onSubmit = async (data: TopUpFormData) => {
        try {
            setIsLoading(true);

            const tokenResponse = await api.get("/auth/api_token");
            let token =tokenResponse.data.token
            if(!token) {
                throw new Error("Token not found");
            }
            const txnId = `TXN_${Date.now()}`;

            const response = await axios.post(
                "https://api.payservices.online/api/v1/payment/paylink",
                {
                    txnId,
                    amount: parseFloat(data.amount.toString()),
                    name: data.name,
                    email: data.email,
                    mobileNumber: data.mobile,
                    redirectUrl: window.location.origin,
                    purpose: data.purpose,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "Success") {
                toast.success("Redirecting to payment gateway...");
                setTimeout(() => {
                    window.location.href = response.data.qr_intent;
                }, 500);
            } else {
                toast.error(response.data.message || "Failed to generate payment link");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Something went wrong. Please try again.";
            toast.error(errorMessage);

            // Log error for debugging
            console.error("Payment API Error:", {
                status: error.response?.status,
                data: error.response?.data,
                token: bearerToken ? "Present" : "Missing"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedAmounts = [500, 1000, 2000, 5000];

    const handleSuggestedAmount = (amount: number) => {
        reset({ amount }, { keepValues: true });
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                {/* Main card */}
                <div className="relative bg-white rounded-3xl p-8 w-full min-w-3xl border border-white/20">

                    {/* Header with token status */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Payment link generator
                                </h2>
                                <p className="text-sm text-gray-500">Add money to your wallet</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">

                        {/* Name field with icon */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-200"
                                        }`}
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters"
                                        }
                                    })}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">•</span> {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-200"
                                        }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email",
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">•</span> {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Mobile field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    placeholder="9876543210"
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.mobile ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-200"
                                        }`}
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[6-9]\d{9}$/,
                                            message: "Enter a valid 10-digit Indian mobile number",
                                        },
                                    })}
                                />
                            </div>
                            {errors.mobile && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">•</span> {errors.mobile.message}
                                </p>
                            )}
                        </div>

                        {/* Amount field with suggestions */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Amount (₹)
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.amount ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-200"
                                        }`}
                                    {...register("amount", {
                                        required: "Amount is required",
                                        min: {
                                            value: 1,
                                            message: "Minimum amount is ₹1",
                                        },
                                        max: {
                                            value: 100000,
                                            message: "Maximum amount is ₹1,00,000",
                                        },
                                    })}
                                />
                            </div>

                            {/* Suggested amounts */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {suggestedAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleSuggestedAmount(amount)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${watchAmount === amount
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        ₹{amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">•</span> {errors.amount.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Purpose
                            </label>
                            <div className="relative">
                                <PictureInPicture className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Wallet topup"
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-indigo-200"
                                        }`}
                                    {...register("purpose", {
                                        required: "purpose is required",
                                        minLength: {
                                            value: 2,
                                            message: "purpose must be at least 2 characters"
                                        }
                                    })}
                                />
                            </div>
                            {errors.purpose && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">•</span> {errors.purpose.message}
                                </p>
                            )}
                        </div>

                        {/* Summary */}
                        {watchAmount > 0 && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-2.5 border border-indigo-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">You'll pay:</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{watchAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 ${isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    <span>Proceed to Payment</span>
                                </>
                            )}
                        </button>

                        {/* Security note */}
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-4">
                            <Shield className="w-3 h-3" />
                            <span>Secured by 256-bit encryption</span>
                            <Sparkles className="w-3 h-3" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SelfWalletTopUp;