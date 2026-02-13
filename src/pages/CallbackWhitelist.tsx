import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import api from "../axiosInstance";

export default function CallbackUrls() {
  const [loading, setLoading] = useState(true);
  const [userMeta, setUserMeta] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchUserMeta();
  }, []);

  const fetchUserMeta = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/user-meta/me');
      setUserMeta(data.data);
      reset({
        payInCallbackUrl: data.data?.payInCallbackUrl || '',
        payOutCallbackUrl: data.data?.payOutCallbackUrl || ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/user-meta/upsert', formData);
      setUserMeta(data.data);
      toast.success('Callback URLs updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Callback URLs Management | Admin Dashboard"
        description="Manage your callback URLs"
      />
      <PageBreadcrumb pageTitle="Callback URLs" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] xl:px-4 xl:py-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Callback URL Configuration
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set up your payment callback URLs for transaction notifications
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pay-In Callback URL
                </label>
                <input
                  type="url"
                  {...register('payInCallbackUrl')}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="https://example.com/payin-callback"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pay-Out Callback URL
                </label>
                <input
                  type="url"
                  {...register('payOutCallbackUrl')}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="https://example.com/payout-callback"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => reset({
                  payInCallbackUrl: userMeta?.payInCallbackUrl || '',
                  payOutCallbackUrl: userMeta?.payOutCallbackUrl || ''
                })}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                {loading ? (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Current Configuration
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay-In Callback URL</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-all">
                {userMeta?.payInCallbackUrl || 'Not configured'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay-Out Callback URL</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-all">
                {userMeta?.payOutCallbackUrl || 'Not configured'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}