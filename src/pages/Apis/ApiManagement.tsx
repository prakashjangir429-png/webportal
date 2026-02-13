import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal/index";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../axiosInstance";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import Switch from "../../components/form/switch/Switch";

const ApiSwitchManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        role: ""
    });
    const [availableApis, setAvailableApis] = useState({
        payIn: [],
        payOut: []
    });
    const [bulkChanges, setBulkChanges] = useState({
        payInApi: "",
        payOutApi: "",
        applyToAll: false
    });
    const { isOpen: isBulkModalOpen, openModal: openBulkModal, closeModal: closeBulkModal } = useModal();
    const { isOpen: isUserModalOpen, openModal: openUserModal, closeModal: closeUserModal } = useModal();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    useEffect(() => {
        fetchAvailableApis();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters
            };

            const response = await api.get("/auth/users", { params });
            setUsers(response.data?.users || []);
            setTotal(response.data?.pagination?.total || 0);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableApis = async () => {
        try {
            const response = await api.get("/payIn");
            const payout = await api.get("/payOut")
            setAvailableApis({
                payIn: response?.data?.data,
                payOut: payout?.data?.data
            })

        } catch (error) {
            console.error("Error fetching available APIs:", error);
            toast.error("Failed to fetch available APIs");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const prepareBulkUpdate = () => {
        setBulkChanges({
            payInApi: "",
            payOutApi: "",
            applyToAll: false
        });
        openBulkModal();
    };

    const prepareUserUpdate = (user) => {
        setCurrentUser(user);
        openUserModal();
    };

    const handleBulkChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBulkChanges(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUserApiChange = (user, field, value) => {
        const updatedUsers = users.map(u =>
            u._id === user._id ? { ...u, [field]: value } : u
        );
        setUsers(updatedUsers);
    };

    const saveBulkChanges = async () => {
        console.log(bulkChanges);

        try {
            await api.put("/auth/bulk", bulkChanges);
            toast.success("Bulk API changes applied successfully");
            fetchUsers();
            closeBulkModal();
        } catch (error) {
            console.error("Error applying bulk changes:", error);
            toast.error(error.response?.data?.message || "Failed to apply bulk changes");
        }
    };

    const saveUserChanges = async () => {
        if (!currentUser) return;

        try {
            await api.put(`/auth/switch/${currentUser._id}`, {
                payInApi: currentUser.payInApi,
                payOutApi: currentUser.payOutApi
            });
            toast.success("User API settings updated successfully");
            fetchUsers();
            closeUserModal();
        } catch (error) {
            console.error("Error updating user APIs:", error);
            toast.error(error.response?.data?.message || "Failed to update user APIs");
        }
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            search: "",
            role: ""
        });
    };

    return (
        <div>
            <PageMeta
                title="API Switch Management | Your App Name"
                description="Manage payment APIs for users"
            />
            <PageBreadcrumb pageTitle="API Switch Management" />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-white/[0.03] xl:px-4 xl:py-4">
                {/* Filters Section */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* Search Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search Users
                        </label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search users..."
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Filter by Role
                        </label>
                        <select
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Roles</option>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Agent">Agent</option>
                        </select>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="mb-4 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={resetFilters}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            Reset Filters
                        </button>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Rows per page:
                            </label>
                            <select
                                name="limit"
                                value={filters.limit}
                                onChange={handleFilterChange}
                                className="rounded-md border border-gray-300 bg-white py-1 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={prepareBulkUpdate}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                    >
                        Bulk Update APIs
                    </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Pay-In API
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Pay-Out API
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={user.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                                                            alt={user.userName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {user.userName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === 'admin'
                                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                        : user.role === 'agent'
                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <select
                                                    value={user.payInApi || ""}
                                                    onChange={(e) => handleUserApiChange(user, "payInApi", e.target.value)}
                                                    className="rounded-md border border-gray-300 bg-white py-1 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                >
                                                    <option value="">Default</option>
                                                    {availableApis.payIn.map(api => (
                                                        <option key={api._id} value={api._id}>{api.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <select
                                                    value={user.payOutApi || ""}
                                                    onChange={(e) => handleUserApiChange(user, "payOutApi", e.target.value)}
                                                    className="rounded-md border border-gray-300 bg-white py-1 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                >
                                                    <option value="">Default</option>
                                                    {availableApis.payOut.map(api => (
                                                        <option key={api._id} value={api._id}>{api.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <button
                                                    onClick={() => prepareUserUpdate(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    Save Changes
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                                        >
                                            No users found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {total > 0 && (
                    <div className="mt-4 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                            Showing{" "}
                            <span className="font-medium">
                                {(filters.page - 1) * filters.limit + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(filters.page * filters.limit, total)}
                            </span>{" "}
                            of <span className="font-medium">{total}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className={`rounded-md border border-gray-300 px-3 py-1 text-sm ${filters.page === 1
                                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    }`}
                            >
                                Previous
                            </button>
                            {Array.from(
                                { length: Math.ceil(total / filters.limit) },
                                (_, i) => i + 1
                            )
                                .slice(
                                    Math.max(0, filters.page - 3),
                                    Math.min(Math.ceil(total / filters.limit), filters.page + 2)
                                )
                                .map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-1 text-sm ${filters.page === pageNum
                                            ? "border-indigo-500 bg-indigo-500 text-white"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page * filters.limit >= total}
                                className={`rounded-md border border-gray-300 px-3 py-1 text-sm ${filters.page * filters.limit >= total
                                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Update Modal */}
            <Modal isOpen={isBulkModalOpen} onClose={closeBulkModal} className="max-w-md ">
                <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Bulk Update Payment APIs
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Apply these API settings to multiple users at once
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mt-7 space-y-5">
                                <div>
                                    <Label>Pay-In API</Label>
                                    <select
                                        name="payInApi"
                                        value={bulkChanges.payInApi}
                                        onChange={handleBulkChange}
                                        className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">No Change</option>
                                        {availableApis.payIn.map(api => (
                                            <option key={api._id} value={api._id}>{api.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label>Pay-Out API</Label>
                                    <select
                                        name="payOutApi"
                                        value={bulkChanges.payOutApi}
                                        onChange={handleBulkChange}
                                        className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">No Change</option>
                                        {availableApis.payOut.map(api => (
                                            <option key={api._id} value={api._id}>{api.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <Switch
                                        name="applyToAll"
                                        checked={bulkChanges.applyToAll}
                                        onChange={handleBulkChange}
                                    />
                                    <Label className="ml-2">Apply to all users (including future users)</Label>
                                </div>

                                {bulkChanges.applyToAll && (
                                    <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Warning
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                    <p>
                                                        This will override all existing user API settings and will be applied to all future users as well.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeBulkModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveBulkChanges();
                                }}
                            >
                                Apply Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* User Update Modal */}
            <Modal isOpen={isUserModalOpen} onClose={closeUserModal} className="max-w-md">
                {currentUser && (
                    <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Update API Settings for {currentUser.userName}
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                Configure payment APIs for this specific user
                            </p>
                        </div>
                        <form className="flex flex-col">
                            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                                <div className="mt-7 space-y-5">
                                    <div>
                                        <Label>Pay-In API</Label>
                                        <select
                                            value={currentUser.payInApi || ""}
                                            onChange={(e) => setCurrentUser({ ...currentUser, payInApi: e.target.value })}
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="">Default</option>
                                            {availableApis.payIn.map(api => (
                                                <option key={api._id} value={api._id}>{api.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label>Pay-Out API</Label>
                                        <select
                                            value={currentUser.payOutApi || ""}
                                            onChange={(e) => setCurrentUser({ ...currentUser, payOutApi: e.target.value })}
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="">Default</option>
                                            {availableApis.payOut.map(api => (
                                                <option key={api._id} value={api._id}>{api.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={closeUserModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        saveUserChanges();
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ApiSwitchManagement;