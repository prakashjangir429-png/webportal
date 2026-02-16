import { useState, useEffect } from "react";
import moment from "moment";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal/index";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../axiosInstance";
import { toast } from "react-toastify";
import Analytics from "../Charts/Analytics";
import { useAuth } from "../../context/UserContext";
import { RecycleIcon } from "lucide-react";

const PayoutReports = ({ model }: any) => {
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const { user } = useAuth() as any;
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [stats, setStats] = useState();
    const [selectedReport, setSelectedReport] = useState(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: -1,
        user_id: "",
        fromDate: "",
        toDate: "",
        status: "",
        minAmount: "",
        maxAmount: "",
        search: ""
    });

    // Status options
    const statusOptions = ["Pending", "Success", "Failed"];

    useEffect(() => {
        fetchReports();
    }, [filters, model]);

    useEffect(() => {
        if (user.role === "Admin") fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/auth/flatens");
            setUsers(response.data?.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                exportCsv: false
            };
            const response = await api.get(model == 'Settlements' ? `/report/settlements` : `/report/payout/reports`, { params });
            setReports(response.data?.data);
            setStats(response.data?.stats);
            setTotal(response.data?.pagination?.total);
        } catch (error) {
            console.error(`Error fetching ${model} reports:`, error);
        } finally {
            setLoading(false);
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

    const handleDateChange = (e) => {
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

    const handleSort = (column) => {
        setFilters(prev => ({
            ...prev,
            sortBy: column,
            order: prev.sortBy === column ? prev.order * -1 : -1,
            page: 1
        }));
    };

    const handleExportCSV = async () => {
        try {
            toast.success("Preparing CSV export...");

            const params = {
                ...filters,
                exportCsv: true
            };
            const response = await api.get(model == 'Settlements' ? `/report/settlements` : `/report/payout/reports`, {
                params,
                responseType: "blob"
            });
            const filename = `${model}_${moment().format("YYYYMMDD_HHmmss")}.csv`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("CSV exported successfully");
        } catch (error) {
            console.error("Error exporting CSV:", error);
            toast.error("Failed to export CSV");
        }
    };


    const renderSortIcon = (column) => {
        if (filters.sortBy !== column) return null;
        return filters.order === -1 ? "▼" : "▲";
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: -1,
            user_id: "",
            fromDate: "",
            toDate: "",
            status: "",
            minAmount: "",
            maxAmount: "",
            search: ""
        });
    };

    const viewReportDetails = (report) => {
        setSelectedReport(report);
        openModal();
    };

    return (
        <div className="">
            <PageMeta
                title={`${model} Reports`}
                description={`View and manage ${model} reports`}
            />
            <PageBreadcrumb pageTitle={`${model} Reports`} />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] xl:px-4 xl:py-4">
                {/* Filters Section */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* User Filter */}
                    {user.role == "Admin" && <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            User
                        </label>
                        <select
                            name="user_id"
                            value={filters.user_id}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Users</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.userName || user.email}
                                </option>
                            ))}
                        </select>
                    </div>}

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Statuses</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleDateChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleDateChange}
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Amount Range Filters */}
                    {user.role !== "User" && <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Min Amount
                            </label>
                            <input
                                type="number"
                                name="minAmount"
                                value={filters.minAmount}
                                onChange={handleFilterChange}
                                placeholder="Minimum amount"
                                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Amount
                            </label>
                            <input
                                type="number"
                                name="maxAmount"
                                value={filters.maxAmount}
                                onChange={handleFilterChange}
                                placeholder="Maximum amount"
                                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Search (Trx ID, Account, UTR, IFSC)
                            </label>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search reports..."
                                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div> </>}
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

                    <div className="flex gap-4">
                        {user.role == "Admin" &&
                            <button
                                onClick={() => setIsAnalyticsOpen(true)}
                                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                View Analytics
                            </button>
                        }
                        <button
                            onClick={handleExportCSV}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                        >
                            Export to CSV
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto max-w-full rounded-lg border border-gray-200 dark:border-gray-700">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                                        onClick={() => handleSort("createdAt")}
                                    >
                                        Date {renderSortIcon("createdAt")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        Trx ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        User
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                                        onClick={() => handleSort("amount")}
                                    >
                                        Amount {renderSortIcon("amount")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                                        onClick={() => handleSort("gatewayCharge")}
                                    >

                                        Charges {renderSortIcon("gatewayCharge")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        Account
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        UTR
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status {renderSortIcon("status")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {reports.length > 0 ? (
                                    reports.map((report) => (
                                        <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {moment(report.createdAt).format("MMM D, YYYY h:mm A")}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {report.trxId}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {report.userName}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                ₹{report.amount.toFixed(2)}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                ₹{report.gatewayCharge.toFixed(2)}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {report.accountNumber}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {report.utr || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${report.status === "Success"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : report.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        }`}
                                                >
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap flex items-center gap-4 justify-center px-2 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                <button
                                                    onClick={() => viewReportDetails(report)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    View
                                                </button>
                                                {user.role === "Admin" &&
                                                    <button
                                                        disabled={report.status == "Failed" || report.status == "Success" || buttonLoading}
                                                        onClick={async () => {
                                                            setButtonLoading(true);
                                                            try {
                                                                const response = await api.put(`/payments/update_status/${report.trxId}`);
                                                                alert(JSON.stringify(response.data))
                                                            } catch (error) {
                                                                alert(JSON.stringify(error) || "Error updating status");
                                                            } finally {
                                                                setButtonLoading(false);
                                                            }

                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        {!buttonLoading ? (
                                                            <RecycleIcon className="h-5 w-5" />
                                                        ) : (
                                                            <span className="flex items-center">
                                                                <RecycleIcon className="h-5 w-5 animate-spin" />
                                                            </span>
                                                        )}
                                                    </button>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                                        >
                                            No reports found matching your criteria
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

            {/* Report Details Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {model} Report Details
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Detailed information about this {model} transaction
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            {selectedReport && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <h6 className="mb-3 text-base font-medium text-gray-800 dark:text-white/90">
                                                Transaction Information
                                            </h6>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.trxId}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">UTR</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.utr || "N/A"}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>

                                        <div>
                                            <h6 className="mb-3 text-base font-medium text-gray-800 dark:text-white/90">
                                                Financial Information
                                            </h6>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹{selectedReport.amount.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gateway Charge</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        ₹{selectedReport.gatewayCharge?.toFixed(2) || "0.00"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${selectedReport.status === "Success"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                : selectedReport.status === "Pending"
                                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                }`}
                                                        >
                                                            {selectedReport.status}
                                                        </span>
                                                    </p>
                                                </div>
                                                {user.role == "Admin" && selectedReport.failureReason && (
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Failure Reason</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {selectedReport.failureReason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <h6 className="mb-3 text-base font-medium text-gray-800 dark:text-white/90">
                                                User Information
                                            </h6>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.userName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.mobileNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h6 className="mb-3 text-base font-medium text-gray-800 dark:text-white/90">
                                                Bank Account Information
                                            </h6>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Holder</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.accountHolderName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.accountNumber}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">IFSC Code</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.ifscCode}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {selectedReport.bankName || "N/A"}
                                                    </p>
                                                </div>
                                                {selectedReport.upiId && (
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">UPI ID</p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {selectedReport.upiId}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h6 className="mb-3 text-base font-medium text-gray-800 dark:text-white/90">
                                            Timestamps
                                        </h6>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {moment(selectedReport.createdAt).format("MMM D, YYYY h:mm A")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {moment(selectedReport.updatedAt).format("MMM D, YYYY h:mm A")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeModal}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Analytics
                isOpen={isAnalyticsOpen}
                onClose={() => setIsAnalyticsOpen(false)}
                stats={stats} // Pass your transactions data
            />
        </div>
    );
};

export default PayoutReports;