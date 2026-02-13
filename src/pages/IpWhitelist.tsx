import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import api from "../axiosInstance";

export default function IpWhitelist() {
  const [loading, setLoading] = useState(true);
  const [userMeta, setUserMeta] = useState(null);
  const [ip1, setIp1] = useState('');
  const [ip2, setIp2] = useState('');

  useEffect(() => {
    fetchUserMeta();
  }, []);

  const fetchUserMeta = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/user-meta/me');
      setUserMeta(data.data);
      const ips = data.data?.whitelistedIPs || [];
      setIp1(ips[0] || '');
      setIp2(ips[1] || '');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const whitelistedIPs = [ip1, ip2].filter(ip => ip.trim() !== '');
      
      if (whitelistedIPs.length > 2) {
        toast.error('Maximum 2 IP addresses allowed');
        return;
      }

      const { data } = await api.put('/user-meta/whitelist', {
        userId: userMeta.userId,
        whitelistedIPs
      });
      
      setUserMeta(data.data);
      toast.success('IP Whitelist updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const ips = userMeta?.whitelistedIPs || [];
    setIp1(ips[0] || '');
    setIp2(ips[1] || '');
  };

  return (
    <div>
      <PageMeta
        title="IP Whitelist Management | Admin Dashboard"
        description="Manage your whitelisted IP addresses"
      />
      <PageBreadcrumb pageTitle="IP Whitelist" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] xl:px-4 xl:py-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            IP Whitelist Configuration
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add up to 2 IP addresses to whitelist (IPv4 or IPv6)
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP Address 1
                </label>
                <input
                  type="text"
                  value={ip1}
                  onChange={(e) => setIp1(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="192.168.1.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP Address 2
                </label>
                <input
                  type="text"
                  value={ip2}
                  onChange={(e) => setIp2(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="10.0.0.1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
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
                ) : 'Save IPs'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
            Current Whitelisted IPs
          </h4>
          {userMeta?.whitelistedIPs?.length > 0 ? (
            <div className="space-y-3">
              {userMeta.whitelistedIPs.map((ip, index) => (
                <div key={index} className="flex items-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {index + 1}
                  </span>
                  <span className="ml-3 font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {ip}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No IP addresses are currently whitelisted
            </p>
          )}
        </div>
      </div>
    </div>
  );
}