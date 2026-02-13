import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "../../components/ui/modal/index";
import Button from "../../components/ui/button/Button";
import api from "../../axiosInstance";

const GenerateChargebackModal = ({
    isOpen,
    onClose,
    transaction,
    onSuccess
}: any) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [chargebackReason, setChargebackReason] = useState("");

    const onSubmit = async (data) => {
        try {
            const response = await api.post("/chargebacks", {
                txnId: transaction.txnId,
                reason: data.reason,
                charges: data.charges
            });

            if (response.data.success) {
                toast.success("Chargeback generated successfully");
                onSuccess();
                onClose();
            } else {
                toast.error(response.data.message || "Failed to generate chargeback");
            }
        } catch (error) {
            toast.error(
                error?.message ||
                "An error occurred while generating chargeback"
            );
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
            <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                <div className="px-2">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Generate Chargeback
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        Create a chargeback for transaction: {transaction?.txnId}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6 px-2">
                        {/* Transaction Summary */}
                        <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h6 className="text-base font-medium text-gray-800 dark:text-white/90">
                                Transaction Details
                            </h6>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        ₹{transaction?.amount?.toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${transaction?.status === "Success"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}>
                                        {transaction?.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Payer Name</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {transaction?.payerName || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Chargeback Form */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Reason for Chargeback *
                                </label>
                                <textarea
                                    id="reason"
                                    rows={4}
                                    className={`w-full rounded-lg border ${errors.reason ? "border-red-500" : "border-gray-300"
                                        } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                                    {...register("reason", {
                                        required: "Reason is required",
                                        minLength: {
                                            value: 10,
                                            message: "Reason must be at least 10 characters"
                                        }
                                    })}
                                    value={chargebackReason}
                                    onChange={(e) => setChargebackReason(e.target.value)}
                                    placeholder="Enter detailed reason for chargeback..."
                                />
                                {errors.reason && (
                                    <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="charges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Charges (Additional Fees) *
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        id="charges"
                                        className={`block w-full rounded-lg border ${errors.charges ? "border-red-500" : "border-gray-300"
                                            } px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
                                        {...register("charges", {
                                            required: "Charges amount is required",
                                            min: {
                                                value: 0,
                                                message: "Charges cannot be negative"
                                            },
                                            max: {
                                                value: 10000,
                                                message: "Charges cannot exceed $10,000"
                                            },
                                            valueAsNumber: true
                                        })}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                {errors.charges && (
                                    <p className="mt-1 text-sm text-red-600">{errors.charges.message}</p>
                                )}
                            </div>


                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    <span className="font-semibold">Note:</span> This action will deduct ₹
                                    {transaction?.amount?.toFixed(2)} from the user's eWallet balance.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                disabled={isSubmitting || !chargebackReason}
                                isLoading={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Confirm Chargeback"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default GenerateChargebackModal;